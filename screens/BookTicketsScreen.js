// screens/BookTicketsScreen.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

export default function BookTicketsScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.heading}>Choose Language</Text>
      <View style={styles.languageContainer}>
        <TouchableOpacity style={styles.languageButton}>
          <Text style={styles.languageText}>English</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.languageButton}>
          <Text style={styles.languageText}>Greek</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.heading}>Performances</Text>

      {/* Main Hall */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Main Hall: Hamlet</Text>
        <Text style={styles.cardSubtitle}>Afternoon Show: 2:00 PM</Text>
        <Text style={styles.cardSubtitle}>Evening Show: 7:00 PM</Text>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Tickets</Text>
        </TouchableOpacity>
      </View>

      {/* Secondary Hall */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Secondary Hall: Romeo and Juliet</Text>
        <Text style={styles.cardSubtitle}>Afternoon Show: 2:00 PM</Text>
        <Text style={styles.cardSubtitle}>Evening Show: 8:00 PM</Text>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Tickets</Text>
        </TouchableOpacity>
      </View>

      {/* Navigate to Chat */}
      <TouchableOpacity style={[styles.bookButton, { marginTop: 20 }]} onPress={() => navigation.navigate("Chat")}>
        <Text style={styles.bookButtonText}>Go to Chat</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingVertical: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  languageContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  languageButton: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  languageText: {
    fontSize: 16,
    color: "#000",
  },
  card: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  bookButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
