import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { gql, useQuery } from "@apollo/client";
import OtherPage from "./OtherProfile";

const GET_USER_SEARCH = gql`
  query Users($name: String, $username: String) {
    searchUser(name: $name, username: $username) {
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

export default function Search() {
  const [search, setSearch] = useState("");
  const { data, error, loading } = useQuery(GET_USER_SEARCH, {
    variables: { name: search, username: search },
    pollInterval: 500,
    fetchPolicy: 'network-only'
  });

  return (
    <>
      <ScrollView>
        <StatusBar />
        <View style={styles.container}>
          <View style={styles.searchBox}>
            <View style={styles.searchInput}>
              <FontAwesome5 name="search" size={18} color="gray" />
              <TextInput
                placeholder="Search"
                style={{ flex: 1, width: "98%" }}
                value={search}
                onChangeText={setSearch}
              />
            </View>
          </View>
          {data?.searchUser !== null && data !== undefined ? (
            <View>
              <OtherPage data={data?.searchUser} />
            </View>
          ) : (
            <View>
              <ActivityIndicator size="large" color="#833AB4" />
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBox: {
    height: 60,
    width: "100%",
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderBottomColor: "light gray",
    padding: 10,
    flexDirection: "row",
  },
  searchInput: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    borderRadius: 10,
    padding: 10,
    height: 40,
    width: "95%",
    backgroundColor: "#fafafa",
  },
  button: {
    margin: 10,
    padding: 5,
    height: 40,
    width: 70,
    backgroundColor: "#5675e3",
    borderRadius: 10,
    justifyContent: "center",
  },
});
