import React from "react";
import { TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons"; // or react-native-vector-icons

import InitialScreen from "./screens/InitialScreen";
import BookTicketsScreen from "./screens/BookTicketsScreen";
import ChatScreen from "./screens/ChatScreen";
import BookingDetailsScreen from "./screens/BookingDetailsScreen";
import TheaterContactScreen from "./screens/TheaterContactScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Initial">
        <Stack.Screen name="Initial" component={InitialScreen} options={{ headerShown: false }} />

        <Stack.Screen name="BookTickets" component={BookTicketsScreen} options={{ title: "Performances" }} />

        <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />

        <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} options={{ title: "Your Tickets" }} />
        <Stack.Screen name="TheaterContact" component={TheaterContactScreen} options={{ title: "Contact Us" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
