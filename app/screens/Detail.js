import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

const GET_POST_BY_ID = gql`
  query PostById($postId: String) {
    postById(postId: $postId) {
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

const POST_COMMENT = gql`
  mutation Mutation($comment: newComment) {
    commentPost(comment: $comment) {
      content
      username
      createdAt
      updatedAt
    }
  }
`;

export default function DetailPage({ route }) {
  const [content, setContent] = useState("");
  const { _id, idx } = route.params;
  const navigation = useNavigation();
  const { data, error, loading } = useQuery(GET_POST_BY_ID, {
    variables: {
      postId: _id,
    },
  });
  const [addComment] = useMutation(POST_COMMENT, {
    refetchQueries: [GET_POST_BY_ID, "PostById"],
  });
  const post = data?.postById;

  const handleComment = async () => {
    try {
      const result = await addComment({
        variables: {
          comment: {
            content: content,
            postId: _id,
          },
        },
      });
      setContent("");
      Keyboard.dismiss();
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
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, marginVertical: 5 }}>
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
              {post.author?.username}
            </Text>
          </View>
          <Image
            style={styles.photo}
            source={{
              uri: post.imgUrl,
            }}
          />
          <Text style={{ paddingHorizontal: 10, paddingTop: 5 }}>
            liked by{" "}
            <Text style={{ fontWeight: "bold" }}>{post.likes?.length} </Text>
            people
          </Text>
          <Text style={{ paddingLeft: 10, paddingTop: 5 }}>
            <Text style={{ fontWeight: "bold" }}>{post.author?.username}</Text>{" "}
            {post.content}
          </Text>
          <Text style={{ paddingLeft: 10, paddingTop: 5 }}>Comments</Text>
          <ScrollView>
            <View style={{ paddingLeft: 15 }}>
              {post.comments.map((el, idx) => {
                return (
                  <Text key={idx}>
                    <Text style={{ fontWeight: "bold" }}>{el.username} </Text>
                    {el.content}
                  </Text>
                );
              })}
            </View>
          </ScrollView>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            style={styles.input}
            placeholder="Comment"
            value={content}
            onChangeText={setContent}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleComment();
            }}
          >
            <Text style={{ color: "white" }}>Submit</Text>
          </TouchableOpacity>
        </View>
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
  input: {
    paddingHorizontal: 10,
    backgroundColor: "#d6d6d3",
    width: "82%",
    height: 50,
  },
  button: {
    height: 50,
    width: 70,
    backgroundColor: "#5675e3",
    alignItems: "center",
    justifyContent: "center",
  },
});
