import { useNavigation } from "@react-navigation/native";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";

const POST_NEW_POST = gql`
  mutation Mutation($post: newPost) {
    addPost(post: $post) {
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

export default function NewPost() {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [addPost, { loading }] = useMutation(POST_NEW_POST, {
    refetchQueries: ["Posts"],
  });
  const navigation = useNavigation();

  const handleAddPost = async () => {
    try {
      if (!tags || tags.length === 0) {
        setTags("#exciting #life")
      }
      if (!imgUrl || imgUrl.length === 0) {
        setImgUrl("https://picsum.photos/400")
      }
      Keyboard.dismiss();
      const splitTag = tags.split(" ").map(data => data.split('#')).flat().filter(el => el !== '');
      await addPost({
        variables: {
          post: {
            content: content,
            tags: splitTag,
            imgUrl: imgUrl,
          },
        },
      });
      setContent("");
      setTags("");
      setImgUrl("");
      Alert.alert("Added new post!");
      navigation.navigate("Feed");
    } catch (error) {
      console.log(error);
      Alert.alert(error.message);
    }
  };

  return (
    <>
      <StatusBar />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Feed");
            }}
          >
            <FontAwesome6 name="xmark" size={24} color="black" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>New Post</Text>
        </View>
        <Text style={{ padding: 10, fontSize: 18, fontWeight: "heavy" }}>
          What's on your mind?
        </Text>
        <ScrollView>
          <View style={{ alignItems: "center" }}>
            <TextInput
              style={styles.input}
              value={content}
              multiline={true}
              onChangeText={setContent}
              placeholder="What's happening?"
            />
            <TextInput
              style={styles.inputTag}
              value={tags}
              onChangeText={setTags}
              placeholder="#exciting #life"
            />
            <TextInput
              style={styles.inputTag}
              value={imgUrl}
              onChangeText={setImgUrl}
              placeholder="https://picsum.photos/400"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                handleAddPost();
              }}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFDC80" />
              ) : (
                <Text style={{ color: "white", textAlign: "center" }}>
                  Add Post
                </Text>
              )}
            </TouchableOpacity>
          </View>
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
    gap: 20,
    alignItems: "center",
    alignContent: "center",
    paddingHorizontal: 8,
  },
  container: {
    flex: 1,
  },
  input: {
    textAlignVertical: "top",
    height: 400,
    width: "92%",
    margin: 8,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    paddingHorizontal: 5,
  },
  inputTag: {
    height: 60,
    width: "92%",
    margin: 8,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    paddingHorizontal: 5,
  },
  button: {
    margin: 10,
    padding: 5,
    height: 40,
    width: 100,
    backgroundColor: "#5675e3",
    borderRadius: 10,
    justifyContent: "center",
  },
});
