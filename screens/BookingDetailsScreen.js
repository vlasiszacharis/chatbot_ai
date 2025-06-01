import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function BookingDetailsScreen() {
  const defaultTicket = {
    event: "«Ρωμαιος Και Ιουλιετα»",
    venue: "Θέατρο Αυλαία",
    date: "15 Νοεμβριου 2025",
    time: "21:00",
    seat: "Σειρά Α, Θέση 12",
    price: "€25",
    bookingId: "ABC123456",
  };

  const [ticket, setTicket] = useState(defaultTicket);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bookingConfirmation");
      if (stored) {
        const { date, time, performance } = JSON.parse(stored);

        setTicket((prev) => ({
          ...prev,
          event: performance ? `«${performance}»` : prev.event,
          date: date || prev.date,
          time: time || prev.time,
        }));
      }
    } catch (err) {
      console.warn("Αποτυχία ανάγνωσης από localStorage:", err);
    }
  }, []);

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.header}>Τα Εισιτήριά Σας</Text>
      <View style={styles.ticketContainer}>
        <View style={styles.ticketTop}>
          <Text style={styles.eventName}>{ticket.event}</Text>
          <Text style={styles.venueName}>{ticket.venue}</Text>
        </View>

        <View style={styles.ticketMiddle}>
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>Ημερομηνία</Text>
            <Text style={styles.infoValue}>{ticket.date}</Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>Ώρα</Text>
            <Text style={styles.infoValue}>{ticket.time}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.ticketBottom}>
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>Θέση</Text>
            <Text style={styles.infoValue}>{ticket.seat}</Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>Τιμή</Text>
            <Text style={styles.infoValue}>{ticket.price}</Text>
          </View>
        </View>

        <View style={styles.bookingIdContainer}>
          <Text style={styles.bookingIdLabel}>Κωδικός Κράτησης</Text>
          <Text style={styles.bookingIdValue}>{ticket.bookingId}</Text>
        </View>
      </View>
      <Text style={styles.note}>Σκανάρετε τον κωδικό κράτησης στην είσοδο ή δείξτε τον στο προσωπικό του θεάτρου.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  ticketContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  ticketTop: {
    alignItems: "center",
    marginBottom: 16,
  },
  eventName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
  },
  venueName: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
    textAlign: "center",
  },
  ticketMiddle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  infoColumn: {
    flex: 1,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
    color: "#888",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8,
  },
  ticketBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  bookingIdContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  bookingIdLabel: {
    fontSize: 12,
    color: "#888",
  },
  bookingIdValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 2,
  },
  note: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 12,
  },
});
