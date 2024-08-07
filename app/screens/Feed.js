import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useContext } from "react";
import { AuthContext } from "../App";
import * as SecureStore from "expo-secure-store";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";

const GET_POSTS = gql`
  query Posts {
    posts {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      author {
        name
        username
      }
    }
  }
`;

const LIKE_POST = gql`
  mutation Mutation($like: newLike) {
    likePost(like: $like)
  }
`;

export default function Feed() {
  const navigation = useNavigation();
  const { setSignedIn } = useContext(AuthContext);
  const { data, error, loading } = useQuery(GET_POSTS);

  const [doLike] = useMutation(LIKE_POST, {
    refetchQueries: [GET_POSTS, "Posts"],
  });

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("accessToken");
      setSignedIn(false);
    } catch (error) {
      console.log(error);
      Alert.alert(error.message);
    }
  };

  const handleLike = async (postId) => {
    try {
      const result = await doLike({
        variables: {
          like: {
            postId: postId,
          },
        },
      });
    } catch (error) {
      console.log(error);
      Alert.alert(error.message);
    }
  };

  if (loading) {
    return (
      <>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#833AB4" />
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
      <StatusBar />
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={{ fontSize: 22, fontStyle: "italic", fontWeight:'bold' }}>InstaVibe</Text>
          <TouchableOpacity
            onPress={() => {
              handleLogout();
            }}
          >
            <FontAwesome5 name="sign-out-alt" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <ScrollView>
          {data.posts.map((el, idx) => {
            return (
              <View key={idx} style={{ flex: 1, marginVertical: 5 }}>
                <View style={{ flexDirection: "row", padding: 10 }}>
                  <Image
                    style={styles.profilePic}
                    source={{
                      uri: `https://picsum.photos/200?random=${idx}`,
                    }}
                  />
                  <Text
                    style={{
                      marginStart: 5,
                      textAlignVertical: "center",
                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  >
                    {el.author.username}
                  </Text>
                </View>
                <Image
                  style={styles.photo}
                  source={{
                    uri: el.imgUrl,
                  }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    paddingLeft: 13,
                    paddingTop: 10,
                    gap: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      handleLike(el._id);
                    }}
                  >
                    <FontAwesome6 name="heart" size={24} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("DetailPage", {
                        _id: el._id,
                        idx: idx,
                      });
                    }}
                  >
                    <FontAwesome6
                      name="comment"
                      style={{ marginLeft: 3 }}
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                  <FontAwesome6 name="paper-plane" size={24} color="black" />
                </View>
                <Text style={{ paddingHorizontal: 10, paddingTop: 5 }}>
                  liked by{" "}
                  <Text style={{ fontWeight: "bold" }}>{el.likes.length} </Text>
                  people
                </Text>
                <Text style={{ paddingLeft: 10 }}>
                  <Text style={{ fontWeight: "bold" }}>
                    {el.author.username}
                  </Text>{" "}
                  {el.content}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 5,
                    paddingHorizontal: 10,
                  }}
                >
                {el.tags.map((tag, id) => {
                  return (
                      <Text key={id} style={{color:'#0066CC'}}>#{tag}</Text>
                    );
                  })}
                  </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 55,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  photo: {
    width: "100%",
    height: 400,
  },
  profilePic: {
    width: 30,
    height: 30,
    borderRadius: 30,
    marginRight: 5,
  },
});
