import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContext } from "../App";
import * as SecureStore from "expo-secure-store";

const LOGIN = gql`
  mutation Login($user: loginUser) {
    login(user: $user) {
      accessToken
    }
  }
`;

export default function Login() {
  const { setSignedIn } = useContext(AuthContext);
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [doLogin, { loading }] = useMutation(LOGIN);

  const handleLogin = async () => {
    try {
      Keyboard.dismiss();
      const result = await doLogin({
        variables: {
          user: {
            username: username,
            password: password,
          },
        },
      });
      await SecureStore.setItemAsync(
        "accessToken",
        result.data?.login?.accessToken
      );
      Alert.alert("Login success!");
      setSignedIn(true);
    } catch (error) {
      console.log(error);
      Alert.alert(error.message);
    }
  };

  return (
    <>
      <View style={styles.innerContainer}>
        <View style={{ marginBottom: 40, alignItems: "center" }}>
          <Image
            style={styles.logo}
            source={{
              uri: "https://www.freepnglogos.com/uploads/logo-ig-png/logo-ig-stunning-instagram-logo-vector-download-for-new-7.png",
            }}
          />
          <Text>InstaVibe</Text>
        </View>
        <Text style={{ fontSize: 32, fontWeight: "bold", alignItems: "start" }}>
          Log In
        </Text>
        <View style={{ alignItems: "center" }}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleLogin();
            }}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFDC80" />
            ) : (
              <Text style={{ color: "white", textAlign: "center" }}>
                Log In
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <Text>-------- OR --------</Text>
        <TouchableOpacity
          style={{
            margin: 10,
            padding: 5,
            height: 40,
            width: 190,
            backgroundColor: "#FFDC80",
            borderRadius: 10,
            justifyContent: "center",
          }}
          onPress={() => {
            navigation.navigate("Register");
          }}
        >
          <Text style={{ color: "black", textAlign: "center" }}>
            Sign Up Here
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  input: {
    height: 50,
    width: 300,
    margin: 13,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 5,
  },
  logo: {
    width: 80,
    height: 80,
  },
  button: {
    margin: 10,
    padding: 5,
    height: 40,
    width: 190,
    backgroundColor: "#5675e3",
    borderRadius: 10,
    justifyContent: "center",
  },
});
