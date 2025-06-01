import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";

const performances = {
  A: {
    image: require("../screens/images/amlet.png"),
    title: "Άμλετ",
    subtitle: "Κυρίως Παράσταση",
    duration: "Διάρκεια: 2 ώρες 30 λεπτά",
    synopsis: "Το κλασικό δράμα του Σαίξπηρ για το διάσημο πρίγκιπα της Δανίας.",
    actors: "Γιάννης Παπαδόπουλος, Μαρία Καραγιάννη, Κώστας Ιωάννου",
  },
  B: {
    image: require("../screens/images/romeo.png"),
    title: "Ρωμαίος και Ιουλιέτα",
    subtitle: "Κυρίως Παράσταση",
    duration: "Διάρκεια: 2 ώρες",
    synopsis: "Η τραγική ιστορία των δύο νέων εραστών από τον Σαίξπηρ",
    actors: "Ελένη Νικολάου, Ανδρέας Θεοδώρου, Σοφία Δημητρίου",
  },
};

export default function BookTicketsScreen({ navigation }) {
  const [fontSizeOption, setFontSizeOption] = useState("normal");
  const [selected, setSelected] = useState(null);

  const sizes = {
    heading: fontSizeOption === "large" ? 28 : 22,
    cardTitle: fontSizeOption === "large" ? 24 : 20,
    cardSubtitle: fontSizeOption === "large" ? 20 : 16,
    buttonText: fontSizeOption === "large" ? 16 : 14,
    paragraph: fontSizeOption === "large" ? 18 : 14,
  };

  const PerformanceCard = ({ id }) => {
    const perf = performances[id];

    let showTime = "";
    const titleLower = perf.title.toLowerCase();
    if (titleLower.includes("άμλετ")) {
      showTime = "18:00";
    } else if (titleLower.includes("ρωμαίος")) {
      showTime = "21:00";
    } else {
      showTime = "-:--";
    }

    return (
      <View style={styles.card}>
        <Text style={[styles.cardTitle, { fontSize: sizes.cardTitle }]}>{`${id} Αίθουσα: ${perf.title}`}</Text>
        <Text style={[styles.cardSubtitle, { fontSize: sizes.cardSubtitle }]}>Ώρα: {showTime}</Text>
        <TouchableOpacity style={[styles.infoButton, { paddingVertical: 8 }]} onPress={() => setSelected(id)}>
          <Text style={[styles.infoButtonText, { fontSize: sizes.buttonText }]}>Περισσότερες Πληροφορίες</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const PerformanceDetails = ({ id }) => {
    const perf = performances[id];
    return (
      <ScrollView contentContainerStyle={styles.detailsContainer}>
        <Image source={perf.image} style={[styles.image, { height: 350 }]} />
        <Text style={[styles.h1, { fontSize: sizes.heading }]}>{perf.title}</Text>
        <Text style={[styles.h2, { fontSize: sizes.cardTitle }]}>{perf.subtitle}</Text>
        <Text style={[styles.h3, { fontSize: sizes.cardSubtitle }]}>{perf.duration}</Text>
        <Text style={[styles.h3, { fontSize: sizes.cardSubtitle, fontWeight: "700" }]}>Σύνοψη</Text>
        <Text style={[styles.paragraph, { fontSize: sizes.paragraph }]}>{perf.synopsis}</Text>
        <Text style={[styles.h3, { fontSize: sizes.cardSubtitle }]}>Ηθοποιοί</Text>
        <Text style={[styles.paragraph, { fontSize: sizes.paragraph }]}>{perf.actors}</Text>
        <TouchableOpacity style={[styles.bookButton, { paddingVertical: 10 }]} onPress={() => navigation.navigate("Chat")}>
          <Text style={[styles.bookButtonText, { fontSize: sizes.buttonText }]}>Κράτηση Εισιτηρίων</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.backButton, { paddingVertical: 10 }]} onPress={() => setSelected(null)}>
          <Text style={[styles.backButtonText, { fontSize: sizes.buttonText }]}>Επιστροφή</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  if (selected) return <PerformanceDetails id={selected} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.selectorContainer}>
        <Text style={[styles.selectorLabel, { fontSize: sizes.cardSubtitle }]}>Μέγεθος Γραμματοσειράς:</Text>
        <Picker selectedValue={fontSizeOption} style={styles.picker} onValueChange={setFontSizeOption}>
          <Picker.Item label="Κανονικό" value="normal" />
          <Picker.Item label="Μεγάλο" value="large" />
        </Picker>
      </View>
      <Text style={[styles.heading, { fontSize: sizes.heading }]}>Παραστάσεις</Text>
      <PerformanceCard id="A" />
      <PerformanceCard id="B" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", paddingHorizontal: 16 },
  contentContainer: { paddingVertical: 20 },

  selectorContainer: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  selectorLabel: { marginRight: 8, fontWeight: "600", color: "#1F2937" },
  picker: { width: 70, height: 40, backgroundColor: "#E5E7EB", borderRadius: 6 },

  heading: { fontWeight: "700", color: "#111827", marginBottom: 10 },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: { fontWeight: "700", marginBottom: 4, color: "#1F2937" },
  cardSubtitle: { color: "#4B5563", marginBottom: 8 },
  infoButton: { backgroundColor: "#3B82F6", borderRadius: 8, alignItems: "center" },
  infoButtonText: { color: "#FFFFFF", fontWeight: "600" },

  detailsContainer: { padding: 20, alignItems: "center", backgroundColor: "#fff" },
  image: { width: "100%", borderRadius: 12, marginBottom: 20 },
  h1: { fontWeight: "700", color: "#111827", marginBottom: 10 },
  h2: { fontWeight: "600", color: "#1F2937", marginBottom: 8 },
  h3: { fontWeight: "500", color: "#374151", marginTop: 12, marginBottom: 6 },
  paragraph: { color: "#4B5563", textAlign: "center", lineHeight: 22 },

  bookButton: { marginTop: 20, backgroundColor: "#10B981", borderRadius: 8, width: "100%", alignItems: "center" },
  bookButtonText: { color: "#FFFFFF", fontWeight: "600" },

  backButton: { marginTop: 12, backgroundColor: "#000000", borderRadius: 8, width: "100%", alignItems: "center" },
  backButtonText: { color: "#FFFFFF", fontWeight: "600" },
});
