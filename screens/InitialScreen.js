import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { FaTheaterMasks } from "react-icons/fa";

// Εισάγουμε το SweetAlert2 για web
import Swal from "sweetalert2";

export default function InitialScreen({ navigation }) {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const onSignUp = () => {
    if (!userName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Σφάλμα",
        text: "Παρακαλώ συμπληρώστε το όνομα για να συνεχίσετε.",
        confirmButtonText: "Εντάξει",
        customClass: {
          popup: "w-40 p-2",
          title: "text-lg font-bold text-[#4C66DF]",
          htmlContainer: "text-sm",
        },
      });
      return;
    }

    navigation.navigate("Chat", { userName });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <FaTheaterMasks size={28} color="#5664F5" />
        <Text style={styles.headerTitle}>Theater AI</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>
          Όνομα
          <Text style={styles.required}> *</Text>
        </Text>
        <TextInput style={styles.input} placeholder="Εισάγετε το όνομά σας" value={userName} onChangeText={setUserName} />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Εισάγετε το email σας"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Τηλέφωνο</Text>
        <TextInput
          style={styles.input}
          placeholder="Εισάγετε τον αριθμό τηλεφώνου σας"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <TouchableOpacity style={[styles.button, styles.googleBtn]}>
          <Text style={styles.googleText}>Σύνδεση με Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.signUpBtn]} onPress={onSignUp}>
          <Text style={styles.signUpText}>Εγγραφή</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#333",
  },
  form: {
    marginTop: "30%",
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
    flexDirection: "row",
  },
  required: {
    color: "red",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 12,
  },
  googleBtn: {
    backgroundColor: "#4285F4",
  },
  googleText: {
    color: "#fff",
    fontSize: 16,
  },
  signUpBtn: {
    backgroundColor: "#000",
  },
  signUpText: {
    color: "#fff",
    fontSize: 16,
  },
});
