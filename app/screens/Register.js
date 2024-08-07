import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { gql, useMutation } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

const REGISTER_USER = gql`
  mutation Mutation($user: newUser) {
    register(user: $user) {
      _id
      name
      username
      email
      password
      following {
        _id
        followingId
        followerId
        createdAt
        updatedAt
      }
      followingDetail {
        _id
        name
        username
      }
      follower {
        _id
        followingId
        followerId
        createdAt
        updatedAt
      }
      followerDetail {
        _id
        name
        username
      }
    }
  }
`;

export default function Register() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [goRegister, { loading }] = useMutation(REGISTER_USER);

  const handleRegister = async () => {
    try {
      Keyboard.dismiss();
      const result = await goRegister({
        variables: {
          user: {
            name: name,
            username: username,
            email: email,
            password: password
          }
        }
      });
      Alert.alert('Register success!')
      navigation.goBack()
    } catch (error) {
      console.log(error);
      Alert.alert(error.message);
    }
  };

  return (
    <>
      <View style={styles.outerContainer}>
        <StatusBar />
        <TouchableOpacity
          style={{
            margin: 10,
            padding: 5,
            height: 40,
            borderRadius: 10,
            justifyContent: "center",
          }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.container}>
          <View style={{ marginBottom: 40, alignItems: "center" }}>
            <Image
              style={styles.logo}
              source={{
                uri: "https://www.freepnglogos.com/uploads/logo-ig-png/logo-ig-stunning-instagram-logo-vector-download-for-new-7.png",
              }}
            />
            <Text>InstaVibe</Text>
          </View>
          <Text
            style={{ fontSize: 32, fontWeight: "bold", alignItems: "start" }}
          >
            Sign Up
          </Text>

          <View style={{ alignItems: "center" }}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              secureTextEntry={true}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                handleRegister();
              }}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFDC80" />
              ) : (
                <Text style={{ color: "white", textAlign: "center" }}>
                  Register
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    padding: 5,
    flex: 1,
  },
  container: {
    padding: 5,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    width: 300,
    margin: 8,
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
