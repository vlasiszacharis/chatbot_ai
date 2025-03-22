// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import InitialScreen from "./screens/InitialScreen";
import BookTicketsScreen from "./screens/BookTicketsScreen";
import ChatScreen from "./screens/ChatScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Initial">
        <Stack.Screen name="Initial" component={InitialScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BookTickets" component={BookTicketsScreen} options={{ title: "Book Tickets" }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ title: "Chat" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
