const { ObjectId } = require("mongodb");
const database = require("../config/mongodb");

class Post {
  static collection() {
    return database.collection("posts");
  }
  static async getAllPosts() {
    const agg = [
      {
        '$lookup': {
          'from': 'users', 
          'localField': 'authorId', 
          'foreignField': '_id', 
          'as': 'author'
        }
      }, {
        '$unwind': {
          'path': '$author'
        }
      }, {
        '$unset': [
          'author.password', 'author._id', 'author.email'
        ]
      }
    ]
    return await this.collection().aggregate(agg).toArray();
  }
  static async getPostById(postId, authorId){
    const agg = [
      {
        '$match': {
          '_id': new ObjectId(String(postId))
        }
      }, {
        '$lookup': {
          'from': 'users', 
          'localField': 'authorId', 
          'foreignField': '_id', 
          'as': 'author'
        }
      }, {
        '$unwind': {
          'path': '$author'
        }
      }, {
        '$unset': [
          'author._id', 'author.email', 'author.password'
        ]
      }
    ]
    return await this.collection().aggregate(agg).toArray()
  }
  static async createPost(newPost, authorId) {
    if (!newPost.content) throw new Error("Content is required");
    newPost.authorId = new ObjectId(String(authorId));
    newPost.createdAt = newPost.updatedAt = new Date();
    newPost.comments = newPost.likes = [];
    const user = await database
      .collection("users")
      .findOne({ _id: newPost.authorId });
    if (!user) throw new Error("Please login first");
    const result = await this.collection().insertOne(newPost);
    return newPost;
  }
  static async addComment(newComment, username) {
    if (!newComment.content) throw new Error("Comment is required");
    if (!username) throw new Error("Please login first");
    newComment.username = username;
    newComment.createdAt = newComment.updatedAt = new Date();
    const { postId } = newComment;
    delete newComment.postId
    const result = await this.collection().updateOne(
      { _id: new ObjectId(String(postId)) },
      { $push: {comments: newComment} }
    );
    return newComment
  }
  static async addLike(newLike, username) {
    if (!username) throw new Error("Please login first");
    newLike.username = username;
    newLike.createdAt = newLike.updatedAt = new Date();
    // console.log(newComment);
    const { postId } = newLike;
    delete newLike.postId
    // console.log(newComment, "<<< mau update");
    const result = await this.collection().updateOne(
      { _id: new ObjectId(String(postId)) },
      { $push: {likes: newLike} }
    );
    return result
  }
}

module.exports = Post;
