import os
import json
from typing import Optional, List
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
import traceback # Για καλύτερη εκτύπωση σφαλμάτων

# --- 1. Φόρτωση Μεταβλητών Περιβάλλοντος (.env file) ---
print("Φόρτωση μεταβλητών περιβάλλοντος...")
load_dotenv()
google_api_key = os.getenv("GOOGLE_API_KEY")

if not google_api_key:
    print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    print("!!! ΠΡΟΕΙΔΟΠΟΙΗΣΗ: Η μεταβλητή GOOGLE_API_KEY δεν βρέθηκε. !!!")
    print("!!! Βεβαιωθείτε ότι έχετε δημιουργήσει ένα αρχείο .env      !!!")
    print("!!! στον ίδιο φάκελο με αυτό το script, και περιέχει:     !!!")
    print("!!! GOOGLE_API_KEY='YOUR_ACTUAL_API_KEY'                  !!!")
    print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    exit("API Key not found. Exiting.")
else:
    print("Το Google API Key φορτώθηκε επιτυχώς από το αρχείο .env.")

# --- 2. Αρχικοποίηση Μοντέλου Γλώσσας Google (Gemini) ---
try:
    print("Αρχικοποίηση μοντέλου ChatGoogleGenerativeAI (gemini-1.5-flash-latest)...")
    # Χρήση Gemini Flash για ταχύτητα και κόστος.
    # Η θερμοκρασία (temperature) είναι χαμηλή για πιο προβλέψιμη εξαγωγή.
    model = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash-latest",
        google_api_key=google_api_key,
        temperature=0.0,
        convert_system_message_to_human=True # Σημαντικό για κάποια μοντέλα/tasks
    )
    print("Το μοντέλο ChatGoogleGenerativeAI αρχικοποιήθηκε επιτυχώς.")
except Exception as e:
    print(f"ΣΦΑΛΜΑ κατά την αρχικοποίηση του ChatGoogleGenerativeAI: {e}")
    exit("Η αρχικοποίηση του μοντέλου απέτυχε.")

# --- 3. Ορισμός Schemas ως Pydantic Models (Εργαλεία για το LLM) ---
# Κάθε class αντιστοιχεί σε ένα intent που μπορεί να έχει παραμέτρους (slots).
# Οι περιγραφές (description) στα Fields βοηθούν το LLM να καταλάβει τι να εξάγει.

print("Ορισμός Pydantic models (schemas) για εξαγωγή παραμέτρων...")

class FindShowParameters(BaseModel):
    """Use this tool when the user wants to find a show based on criteria."""
    show_name: Optional[str] = Field(None, description="The specific title or part of the title of the show the user is looking for.")
    genre: Optional[str] = Field(None, description="The genre of the show (e.g., 'comedy', 'drama', 'musical', 'children's play').")
    date: Optional[str] = Field(None, description="The desired date or timeframe (e.g., 'tonight', 'tomorrow', 'next weekend', '2025-12-25', 'any Friday').")
    time: Optional[str] = Field(None, description="The preferred time (e.g., 'evening', 'matinee', 'around 8pm', 'afternoon').")
    price_range: Optional[str] = Field(None, description="The desired price range (e.g., 'cheap', 'moderate', 'premium', 'any').")

class GetShowDetailsParameters(BaseModel):
    """Use this tool when the user asks for more details about ONE specific show."""
    show_name: str = Field(..., description="The exact title of the show to get details for (e.g., plot, actors, duration, reviews).")

class CheckAvailabilityParameters(BaseModel):
    """Use this tool when the user wants to check ticket availability for a show."""
    show_name: str = Field(..., description="The title of the show to check availability for.")
    date: Optional[str] = Field(None, description="The specific date for checking availability.")
    time: Optional[str] = Field(None, description="The specific time for checking availability.")
    num_tickets: Optional[int] = Field(None, description="The number of tickets for which availability should be checked.")

class BookTicketParameters(BaseModel):
    """Use this tool when the user explicitly states they want to BOOK tickets."""
    show_name: str = Field(..., description="The exact title of the show to book tickets for.")
    num_tickets: int = Field(..., description="The number of tickets the user wants to book.")
    date: Optional[str] = Field(None, description="The specific date for the booking.")
    time: Optional[str] = Field(None, description="The specific time for the booking.")
    seating_preference: Optional[str] = Field(None, description="Any seating preference mentioned (e.g., 'front row', 'aisle', 'balcony').")

class GetTheaterInfoParameters(BaseModel):
    """Use this tool when the user asks for general information ABOUT THE THEATER itself."""
    info_type: str = Field(..., description="The specific type of information requested about the theater (e.g., 'address', 'phone', 'parking', 'website', 'opening_hours', 'location', 'contact', general 'accessibility').")

class RequestRecommendationParameters(BaseModel):
    """Use this tool when the user asks for a recommendation for a show to watch."""
    genre: Optional[str] = Field(None, description="The genre preference for the recommendation, if mentioned.")
    price_range: Optional[str] = Field(None, description="The price range preference for the recommendation, if mentioned.")
    # Add other potential recommendation criteria if needed

class AskAccessibilityParameters(BaseModel):
    """Use this tool when the user asks a specific question about accessibility features or accommodations."""
    feature_query: Optional[str] = Field(None, description="The specific accessibility feature or need mentioned (e.g., 'wheelchair ramps', 'hearing assistance', 'service animals', 'sign language').")
    show_name: Optional[str] = Field(None, description="The show the accessibility question might be related to, if mentioned.")
    date: Optional[str] = Field(None, description="The date the accessibility question might be related to, if mentioned.")

class CancelBookingParameters(BaseModel):
    """Use this tool when the user wants to cancel a previously made booking."""
    booking_reference: str = Field(..., description="The booking reference number or code provided by the user for cancellation.")
    show_name: Optional[str] = Field(None, description="The name of the show associated with the booking, if the user mentions it.")


# Συγκέντρωση όλων των Pydantic models (εργαλείων)
tools = [
    FindShowParameters,
    GetShowDetailsParameters,
    CheckAvailabilityParameters,
    BookTicketParameters,
    GetTheaterInfoParameters,
    RequestRecommendationParameters,
    AskAccessibilityParameters,
    CancelBookingParameters,
]

# --- 4. Σύνδεση Εργαλείων με το Μοντέλο ---
# Αυτό επιτρέπει στο LLM να "δει" τα schemas και να αποφασίσει πότε να τα χρησιμοποιήσει
print("Σύνδεση εργαλείων (Pydantic models) με το μοντέλο LLM...")
llm_with_tools = model.bind_tools(tools)
print("Η σύνδεση των εργαλείων ολοκληρώθηκε.")

# --- 5. Δημιουργία Προτύπου Prompt (Chat Prompt Template) ---
# Το System Message καθοδηγεί το LLM για τον ρόλο του και τη χρήση των εργαλείων.
# Το History παρέχει πλαίσιο διαλόγου.
# Το Human Message είναι η τρέχουσα είσοδος του χρήστη.
print("Δημιουργία προτύπου prompt...")
prompt_template = ChatPromptTemplate.from_messages([
    ("system", """Είσαι ένα εξυπηρετικό και ακριβές AI chatbot για ένα θέατρο.
Ο στόχος σου είναι να καταλάβεις την πρόθεση (intent) του χρήστη και να εξάγεις όλες τις σχετικές παραμέτρους (slots) από την ερώτησή του, χρησιμοποιώντας το ιστορικό διαλόγου για πλαίσιο.

Διαθέσιμα Εργαλεία/Προθέσεις με παραμέτρους: {tool_names}

Οδηγίες:
1. Ανάλυσε την τελευταία φράση του χρήστη ('human' message) στο πλαίσιο του ιστορικού ('history').
2. Προσδιόρισε την κύρια πρόθεση του χρήστη.
3. Αν η πρόθεση ταιριάζει με ένα από τα διαθέσιμα εργαλεία, ΚΑΛΕΣΕ αυτό το εργαλείο και συμπλήρωσε ΟΛΕΣ τις παραμέτρους που μπορείς να βρεις στην ερώτηση του χρήστη ή στο πρόσφατο ιστορικό.
4. Αν η πρόθεση ΔΕΝ ταιριάζει με κάποιο εργαλείο (π.χ., είναι απλός χαιρετισμός 'greet', επιβεβαίωση 'affirm', άρνηση 'negate', ευχαριστία 'thank_you', αποχαιρετισμός 'goodbye'), ΜΗΝ καλέσεις κάποιο εργαλείο. Απλά απάντησε περιγράφοντας την πρόθεση με μία λέξη (π.χ. "greet", "affirm", "negate", "thank_you", "goodbye").
5. Βασίσου ΚΥΡΙΩΣ στην ΤΕΛΕΥΤΑΙΑ φράση του χρήστη για την εξαγωγή, αλλά χρησιμοποίησε το ιστορικό για αποσαφήνιση (π.χ. αν λένε "ναι" σε προηγούμενη ερώτηση για κράτηση).

Ιστορικό Διαλόγου:
{chat_history}
"""),
    ("human", "{user_input}")
])

# Λήψη ονομάτων των εργαλείων για το prompt
tool_names = ", ".join([t.__name__ for t in tools])

print(f"Πρότυπο prompt δημιουργήθηκε. Διαθέσιμα εργαλεία για το LLM: {tool_names}")

# --- 6. Δημιουργία Αλυσίδας (Chain) ---
# Συνδυάζει το prompt και το μοντέλο με τα εργαλεία
print("Δημιουργία LangChain chain...")
chain = prompt_template | llm_with_tools
print("Η chain δημιουργήθηκε.")

# --- 7. Διαχείριση Ιστορικού Διαλόγου ---
# Χρησιμοποιούμε λίστα από μηνύματα (HumanMessage, AIMessage) για συμβατότητα με ChatPromptTemplate
dialog_history = []

# --- 8. Κύριος Βρόχος Αλληλεπίδρασης ---
print("\n--- Chatbot Θεάτρου (Intent & Slot Extraction) ---")
print("Γράψτε 'quit' ή 'exit' για να τερματίσετε.")
print("Παραδείγματα: 'Ποιες κωμωδίες παίζονται αύριο βράδυ;', 'Θέλω 2 εισιτήρια για τον Μάγο του Οζ το Σάββατο.', 'Ποια είναι η διεύθυνση του θεάτρου;'")

while True:
    try:
        # Λήψη εισόδου από τον χρήστη
        user_input = input("USER: ")

        if user_input.lower() in ['quit', 'exit', 'τέλος', 'έξοδος']:
            print("SYSTEM: Αντίο! Ελπίζω να βοήθησα.")
            break

        if not user_input:
            continue

        # Προετοιμασία εισόδου για την αλυσίδα
        chain_input = {
            "user_input": user_input,
            "chat_history": dialog_history,
            "tool_names": tool_names # Περνάμε τα ονόματα στο prompt
        }

        # Κλήση της αλυσίδας
        print("SYSTEM: Processing...")
        ai_response_message = chain.invoke(chain_input)

        # Επεξεργασία της απάντησης του LLM
        recognized_intent = "unknown"
        extracted_parameters = {}

        if ai_response_message.tool_calls:
            # Το LLM κάλεσε ένα εργαλείο (Pydantic model)
            print("  LLM Response: Tool Call")
            for tool_call in ai_response_message.tool_calls:
                recognized_intent = tool_call['name'] # Το όνομα του εργαλείου είναι η πρόθεση
                extracted_parameters = tool_call['args'] # Τα ορίσματα είναι οι παράμετροι
                print(f"    -> Intent (from Tool): {recognized_intent}")
                print(f"    -> Parameters: {json.dumps(extracted_parameters, indent=2, ensure_ascii=False)}")
                # ΣΕ ΠΡΑΓΜΑΤΙΚΗ ΕΦΑΡΜΟΓΗ: Εδώ θα καλούσατε τη λογική της εφαρμογής σας
                # π.χ., search_shows(extracted_parameters) ή book_ticket(extracted_parameters)
        else:
            # Το LLM ΔΕΝ κάλεσε εργαλείο - πιθανόν απλή πρόθεση ή δεν μπόρεσε να εξάγει
            print(f"  LLM Response: Text = '{ai_response_message.content}'")
            # Προσπαθούμε να αναγνωρίσουμε απλές προθέσεις από το περιεχόμενο της απάντησης
            response_content = ai_response_message.content.strip().lower()
            simple_intents = ["greet", "affirm", "negate", "thank_you", "goodbye"]
            found_simple = False
            for intent in simple_intents:
                if intent in response_content: # Απλή αντιστοίχιση συμβολοσειράς
                    recognized_intent = intent
                    found_simple = True
                    break
            if not found_simple:
                 # Αν δεν αναγνωριστεί απλή πρόθεση, ίσως είναι άγνωστη ή πιο σύνθετη
                 # Θα μπορούσαμε να έχουμε ένα fallback classifier εδώ αν χρειαστεί
                 recognized_intent = "unknown_or_complex_reply"
                 print(f"    -> Intent (from Text): {recognized_intent} (Content: '{ai_response_message.content}')")
            else:
                 print(f"    -> Intent (from Text): {recognized_intent}")

        # --- Ενημέρωση Ιστορικού Διαλόγου ---
        # Προσθήκη της εισόδου του χρήστη
        dialog_history.append(HumanMessage(content=user_input))

        # Προσθήκη της "κατανόησης" του AI (είτε tool call είτε απλή απάντηση)
        # Η αποθήκευση του AIMessage με τα tool_calls είναι σημαντική για το πλαίσιο
        dialog_history.append(ai_response_message)

        # Προαιρετικά: Περιορισμός μεγέθους ιστορικού για να μην γίνει πολύ μεγάλο
        MAX_HISTORY_TURNS = 10 # Κράτα τα τελευταία 5 ζεύγη μηνυμάτων (User+AI)
        if len(dialog_history) > MAX_HISTORY_TURNS * 2:
            print("  (Trimming dialogue history)")
            dialog_history = dialog_history[-(MAX_HISTORY_TURNS * 2):]

    except KeyboardInterrupt:
        print("\nSYSTEM: Η συνομιλία διακόπηκε. Αντίο!")
        break
    except Exception as e:
        print(f"\nSYSTEM: Προέκυψε ένα μη αναμενόμενο σφάλμα κατά την εκτέλεση:")
        traceback.print_exc() # Εκτύπωση του πλήρους traceback για debugging
        # Θα μπορούσε να γίνει προσπάθεια ανάκτησης ή απλά τερματισμός
        break