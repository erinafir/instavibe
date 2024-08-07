import { gql, useQuery } from "@apollo/client";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const USER_LOGGED_IN = gql`
  query UserLoggedIn {
    userLoggedIn {
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

export default function SelfProfilePage() {
  const { data, error, loading } = useQuery(USER_LOGGED_IN, {
    pollInterval: 500,
    fetchPolicy: 'network-only', // Doesn't check cache before making a network request
  });
  if (loading) {
    return (
      <>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#FFDC80" />
        </View>
      </>
    );
  }

  if (error) {
    return (
      <>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>{error.message}</Text>
        </View>
      </>
    );
  }
  return (
    <>
      <ScrollView>
        <View style={{ flex: 1, padding: 10 }}>
          <View style={styles.header}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {data?.userLoggedIn?.username}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <View
              style={{ flexDirection: "column", gap: 10, alignItems: "center" }}
            >
              <Image
                style={styles.profilePic}
                source={{
                  uri: "https://picsum.photos/200",
                }}
              />
              <Text>{data?.userLoggedIn?.name}</Text>
            </View>
            <View
              style={{ flexDirection: "column", alignItems: "center", flex: 1 }}
            >
              <Text style={styles.textTotal}>
                {data?.userLoggedIn?.followerDetail?.length > 0 ? data?.userLoggedIn?.followerDetail?.length : 0}
              </Text>
              <Text style={styles.textBelowTotal}>Followers</Text>
            </View>
            <View
              style={{ flexDirection: "column", alignItems: "center", flex: 1 }}
            >
              <Text style={styles.textTotal}>
                {data?.userLoggedIn?.followingDetail?.length > 0 ? data?.userLoggedIn?.followingDetail?.length : 0}
              </Text>
              <Text style={styles.textBelowTotal}>Following</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 55,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 0,
    marginBottom: 10,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  textBelowTotal: {
    fontSize: 14,
  },
  textTotal: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
