import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const POST_FOLLOW = gql`
  mutation Mutation($newFollow: newFollow) {
    newFollow(newFollow: $newFollow)
  }
`;

export default function OtherPage({ data }) {
  const navigation = useNavigation();
  const [doFollow, { loading }] = useMutation(POST_FOLLOW);
  const handleFollow = async () => {
    try {
      const result = await doFollow({
        variables: { newFollow: { followingId: data._id } },
        refetchQueries: ['UserLoggedIn']
      });
      if (result.data.newFollow === "Success follow!") {
        Alert.alert("Success follow!");
        navigation.navigate('Feed')
      }
    } catch (error) {
      console.log(error);
      Alert.alert(error.message);
    }
  };

  return (
    <>
      <ScrollView>
        <View style={{ flex: 1, padding: 10 }}>
          <View style={styles.header}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {data?.username}
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
              <Text>{data?.name}</Text>
            </View>
            <View
              style={{ flexDirection: "column", alignItems: "center", flex: 1 }}
            >
              <Text style={styles.textTotal}>
                {loading === false && data.followerDetail?.length > 0
                  ? data?.followerDetail?.length
                  : 0}
              </Text>
              <Text style={styles.textBelowTotal}>Followers</Text>
            </View>
            <View
              style={{ flexDirection: "column", alignItems: "center", flex: 1 }}
            >
              <Text style={styles.textTotal}>
                {loading === false && data.followingDetail?.length > 0
                  ? data?.followingDetail?.length
                  : 0}
              </Text>
              <Text style={styles.textBelowTotal}>Following</Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                handleFollow();
              }}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={{ color: "white", textAlign: "center" }}>
                  Follow
                </Text>
              )}
            </TouchableOpacity>
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
  button: {
    margin: 10,
    padding: 5,
    height: 40,
    width: 70,
    backgroundColor: "#C13584",
    borderRadius: 10,
    justifyContent: "center",
  },
});
