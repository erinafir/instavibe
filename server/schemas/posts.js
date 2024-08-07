const redis = require("../config/redis");
const Post = require("../models/Post");

const typeDefs = `#graphql
  type Comments {
        content: String
        username: String
        createdAt: String
        updatedAt: String
  }

  type Likes {
        username: String
        createdAt: String
        updatedAt: String
  }

  type Post {
    _id: ID
    content: String
    tags: [String]
    imgUrl: String
    authorId: ID
    comments: [Comments]
    likes: [Likes]
    createdAt: String
    updatedAt: String
    author: AuthorDetail
  }

  type AuthorDetail{
    name: String
    username: String
  }

  input newPost{
    content: String
    tags: [String]
    imgUrl: String
  }

  input newComment{
    content: String
    postId: String
  }

  input newLike{
    postId: String
  }

  type Query {
    posts: [Post]
    postById(postId: String): Post
  }

  type Mutation {
    addPost(post: newPost): Post
    commentPost(comment: newComment): Comments
    likePost(like: newLike): String
  }
`;

const resolvers = {
  Query: {
    posts: async (_, __, { auth }) => {
      auth();
      const postCache = await redis.get("posts:all")
      if (postCache) {
        return JSON.parse(postCache)
      }
      let allPost = await Post.getAllPosts();
      await redis.set("posts:all", JSON.stringify(allPost))
      return allPost;
    },
    postById: async (_, {postId}, {auth}) => {
      auth()
      const {_id} = auth()
      const authorId = _id
      const result = await Post.getPostById(postId, authorId)
      return result[0]
    }
  },
  Mutation: {
    addPost: async (_, args, {auth})=> {
      auth()
      const data = { ...args.post }
      const {_id} = auth()
      const authorId = _id
      const result = await Post.createPost(data, authorId)
      await redis.del("posts:all")
      return result
    },
    commentPost: async(_, args, {auth}) => {
      auth()
      const data = { ...args.comment };
      const {username} = auth()
      const result = await Post.addComment(data, username)
      await redis.del("posts:all")
      return result
    },
    likePost: async(_, args, {auth}) => {
      auth()
      const data = { ...args.like};
      const {username} = auth()
      const result = await Post.addLike(data, username)
      await redis.del("posts:all")
      if (result.acknowledged) {
        return "Success add like"
      }
    }
  }
};

module.exports = { typeDefs, resolvers };
