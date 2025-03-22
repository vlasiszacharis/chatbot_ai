import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { v4 as uuidv4 } from "uuid";

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: uuidv4(), text: "Welcome to the Theater Box Office!", sender: "bot" },
    { id: uuidv4(), text: "How can I help you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  //NOTE - Ai integration - dummy for now
  const getAIResponse = (userMessage) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    if (lowerCaseMessage.includes("book")) {
      return "Sure, let’s book your tickets now!";
    } else if (lowerCaseMessage.includes("hello")) {
      return "Hello! How can I help you today?";
    } else if (lowerCaseMessage.includes("bye")) {
      return "Goodbye! Hope to see you soon.";
    } else {
      return "I'm sorry, I didn't understand. Could you try again?";
    }
  };

  const sendMessage = () => {
    if (input.trim() !== "") {
      const userMsg = {
        id: uuidv4(),
        text: input.trim(),
        sender: "user",
      };
      const aiMsg = {
        id: uuidv4(),
        text: getAIResponse(input.trim()),
        sender: "bot",
      };

      setMessages((prevMessages) => [...prevMessages, userMsg, aiMsg]);
      setInput("");
    }
  };

  const renderItem = ({ item }) => {
    const isUser = item.sender === "user";
    return (
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.botBubble]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList data={messages} renderItem={renderItem} keyExtractor={(item) => item.id} style={styles.chatContainer} />
      <View style={styles.inputContainer}>
        <TextInput style={styles.textInput} value={input} onChangeText={setInput} placeholder="Type your message here..." />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

//Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    borderRadius: 8,
    padding: 10,
    marginVertical: 4,
    maxWidth: "80%",
    alignSelf: "flex-start",
  },
  userBubble: {
    backgroundColor: "#E5E7EB",
    alignSelf: "flex-end",
  },
  botBubble: {
    backgroundColor: "#2563EB",
  },
  messageText: {
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#2563EB",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
