import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Feed from "./Feed";
import DetailPage from "./Detail";

const Stack = createNativeStackNavigator();

export default function Home() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Feed"
        component={Feed}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetailPage"
        component={DetailPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
