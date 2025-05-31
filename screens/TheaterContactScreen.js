// screens/TheaterContactScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function TheaterContactScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Us</Text>
      <Text style={styles.info}>📍 Πλατεία Συντάγματος 1, Αθήνα</Text>
      <Text style={styles.info}>📞 +30 210 3201234</Text>
      <Text style={styles.info}>✉️ info@ayleatheater.gr</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 12,
  },
  info: {
    fontSize: 16,
    marginVertical: 4,
  },
});
