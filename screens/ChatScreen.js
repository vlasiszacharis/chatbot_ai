import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { v4 as uuidv4 } from "uuid";
import { Ionicons } from "@expo/vector-icons";
import { FaTheaterMasks } from "react-icons/fa";
import { RiRobot3Fill } from "react-icons/ri";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SIDEBAR_WIDTH = Math.min(SCREEN_WIDTH * 0.75, 300);

const API_URL = "https://8183-34-45-200-214.ngrok-free.app/chat";

export default function ChatScreen({ navigation, route }) {
  const { userName = "", userSurname = "", sessionId = "my_test_session_123" } = route.params || {};
  const displayName = userName && userSurname ? `${userName} ${userSurname}` : "Εσείς";

  const [messages, setMessages] = useState([
    { id: uuidv4(), text: "Καλώς ήρθατε στο Θέατρο AI", sender: "bot", timestamp: new Date() },
    { id: uuidv4(), text: "Πώς μπορώ να σας βοηθήσω;", sender: "bot", timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarX = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

  const toggleSidebar = (show) => {
    Animated.timing(sidebarX, {
      toValue: show ? 0 : -SCREEN_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setSidebarVisible(show));
  };

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || sending) return;

    const userText = trimmedInput;
    const now = new Date();
    setMessages((m) => [...m, { id: uuidv4(), text: userText, sender: "user", timestamp: now }]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: userText,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { reply } = await res.json();

      setMessages((m) => [...m, { id: uuidv4(), text: reply, sender: "bot", timestamp: new Date() }]);

      if (userText === "Επιβεβαιωση Κρατησης") {
        const dateMatch = reply.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
        const timeMatch = reply.match(/(\d{1,2}:\d{2})/);
        const performanceMatch = reply.match(/«([^»]+)»/);

        const date = dateMatch ? dateMatch[1] : "";
        const time = timeMatch ? timeMatch[1] : "";
        const performance = performanceMatch ? performanceMatch[1] : "";

        const bookingData = { date, time, performance };

        try {
          localStorage.setItem("bookingConfirmation", JSON.stringify(bookingData));
        } catch (err) {
          console.warn("Αποτυχία αποθήκευσης στο localStorage:", err);
        }
      }
    } catch {
      setMessages((m) => [...m, { id: uuidv4(), text: "Σφάλμα σύνδεσης.", sender: "bot", timestamp: new Date() }]);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date) => {
    const h = date.getHours().toString().padStart(2, "0");
    const m = date.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  const menuItems = [
    { label: "Πληροφορίες", icon: "information-circle-outline", to: "BookTickets" },
    { label: "Εισιτήρια", icon: "ticket-outline", to: "BookingDetails" },
    { label: "Επικοινωνία", icon: "call-outline", to: "TheaterContact" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => toggleSidebar(true)} style={styles.topIcon}>
          <Ionicons name="menu" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Συνομιλία</Text>
        <View style={styles.topIconPlaceholder} />
      </View>

      {!sidebarVisible && (
        <View style={styles.chatArea}>
          <FlatList
            data={messages}
            renderItem={({ item }) => (
              <View style={styles.messageContainer}>
                <View style={styles.messageHeader}>
                  {item.sender === "bot" ? (
                    <View style={styles.botHeaderLeft}>
                      <RiRobot3Fill size={20} color="#5664F5" style={styles.robotIcon} />
                      <Text style={styles.botTitle}>Bot</Text>
                    </View>
                  ) : (
                    <Text style={styles.userName}>{displayName}</Text>
                  )}
                  <Text style={styles.timeText}>{formatTime(item.timestamp)}</Text>
                </View>
                <View style={[styles.bubble, item.sender === "user" ? styles.userBubble : styles.botBubble]}>
                  <Text style={styles.bubbleText}>{item.text}</Text>
                </View>
              </View>
            )}
            keyExtractor={(i) => i.id}
            contentContainerStyle={styles.chatList}
          />
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Πληκτρολογήστε μήνυμα..."
              editable={!sending}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} disabled={sending}>
              {sending ? <ActivityIndicator color="#5664F5" /> : <Ionicons name="send" size={20} color="#5664F5" />}
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Animated.View
        style={[styles.overlay, { opacity: sidebarX.interpolate({ inputRange: [-SCREEN_WIDTH, 0], outputRange: [0, 0.4] }) }]}
        pointerEvents={sidebarVisible ? "auto" : "none"}
      >
        <TouchableOpacity style={{ flex: 1 }} onPress={() => toggleSidebar(false)} />
      </Animated.View>

      <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarX }] }]}>
        <View style={styles.sidebarHeader}>
          <FaTheaterMasks size={25} color="#5664F5" />
          <TouchableOpacity onPress={() => toggleSidebar(false)} style={styles.closeBtn}>
            <Ionicons name="close" size={28} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        {menuItems.map(({ label, icon, to }, idx) => (
          <TouchableOpacity
            key={to}
            style={[styles.menuItem, { marginTop: idx === 0 ? 32 : 24 }]}
            onPress={() => {
              toggleSidebar(false);
              navigation.navigate(to);
            }}
          >
            <Ionicons name={icon} size={24} color="#5664F5" style={styles.menuIcon} />
            <Text style={styles.menuText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },
  topBar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  topIcon: { width: 56, alignItems: "center", justifyContent: "center" },
  topTitle: { flex: 1, textAlign: "center", fontSize: 20, fontWeight: "600" },
  topIconPlaceholder: { width: 56 },

  chatArea: { flex: 1, height: SCREEN_HEIGHT * 0.9 },
  chatList: { padding: 16 },

  messageContainer: { marginBottom: 12 },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 8,
    marginBottom: 4,
  },
  botHeaderLeft: { flexDirection: "row", alignItems: "center" },
  robotIcon: { marginRight: 6 },
  botTitle: { fontWeight: "bold", color: "#5664F5", marginRight: 8 },
  userName: { fontWeight: "bold", color: "#333" },
  timeText: { color: "#999", fontSize: 12 },

  bubble: { borderRadius: 12, padding: 12, maxWidth: "75%" },
  userBubble: { backgroundColor: "#000", alignSelf: "flex-end" },
  botBubble: { backgroundColor: "#5664F5", alignSelf: "flex-start" },
  bubbleText: { color: "#fff" },

  inputRow: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#eee",
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 40,
    fontSize: 16,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#000",
  },

  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: "#fafafa",
    borderRightWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    paddingTop: 12,
  },
  sidebarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  closeBtn: { padding: 4 },
  divider: { height: 1, backgroundColor: "#ccc", marginHorizontal: 16 },

  menuItem: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20 },
  menuIcon: { marginRight: 16 },
  menuText: { fontSize: 18, color: "#333" },
});
