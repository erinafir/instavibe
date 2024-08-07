import { Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Register from "./screens/Register";
import Login from "./screens/Login";
import Home from "./screens/Home";
import SelfProfilePage from "./screens/Profile";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createContext, useEffect, useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import Search from "./screens/Search";
import * as SecureStore from "expo-secure-store";
import { ApolloProvider } from "@apollo/client";
import client from "./apollo";
import NewPost from "./screens/AddPost";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
export const AuthContext = createContext(null);

export default function App() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    async function checkToken() {
      const token = await SecureStore.getItemAsync("accessToken");
      if (token) setSignedIn(true);
    }
    checkToken();
  }, []);

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={{ setSignedIn }}>
        <NavigationContainer>
          {signedIn ? (
            <Tab.Navigator>
              <Tab.Screen
                name="Home"
                component={Home}
                options={{
                  headerShown: false,
                  tabBarIcon: () => (
                    <FontAwesome5 name="home" size={24} color="black" />
                  ),
                }}
              />
               <Tab.Screen
                name="NewPost"
                component={NewPost}
                options={{
                  headerShown: false,
                  tabBarIcon: () => (
                    <FontAwesome5 name="plus" size={24} color="black" />
                  ),
                }}
              />
               <Tab.Screen
                name="Search"
                component={Search}
                options={{
                  headerShown: false,
                  tabBarIcon: () => (
                    <FontAwesome5 name="search" size={24} color="black" />
                  ),
                }}
              />
              <Tab.Screen
                name="Profile"
                component={SelfProfilePage}
                options={{
                  headerShown: false,
                  tabBarIcon: () => (
                    <Image
                      style={{ width: 25, height: 25, borderRadius: 30 }}
                      source={{ uri: "https://picsum.photos/200" }}
                    />
                  ),
                }}
              />
            </Tab.Navigator>
          ) : (
            <Stack.Navigator>
              <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Register"
                component={Register}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </AuthContext.Provider>
    </ApolloProvider>
  );
}


