const { ObjectId } = require("mongodb");
const database = require("../config/mongodb");
const { hashPassword } = require("../helper/bcrypt");
const validateEmail = require("../helper/validmail");

class User {
  static collection() {
    return database.collection("users");
  }
  static async getAllUser() {
    const agg = [
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "followerId",
          as: "following",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "following.followingId",
          foreignField: "_id",
          as: "followingDetail",
        },
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "followingId",
          as: "follower",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "follower.followerId",
          foreignField: "_id",
          as: "followerDetail",
        },
      },
    ];
    const result = await this.collection().aggregate(agg).toArray();
    return result
  }
  static async searchByNameUsername(name, username) {
    if (name) {
      const agg = [
        {
          $match: {
            name: name,
          },
        },
        {
          $lookup: {
            from: "follows",
            localField: "_id",
            foreignField: "followerId",
            as: "following",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "following.followingId",
            foreignField: "_id",
            as: "followingDetail",
          },
        },
        {
          $lookup: {
            from: "follows",
            localField: "_id",
            foreignField: "followingId",
            as: "follower",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "follower.followerId",
            foreignField: "_id",
            as: "followerDetail",
          },
        },
      ];
      let result =  await this.collection().aggregate(agg).toArray();
      if (result.length > 0) {
        return result[0];
      } else {
        throw new Error('User not found')
      }
    } else if (username) {const agg = [
      {
        $match: {
          username: username,
        },
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "followerId",
          as: "following",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "following.followingId",
          foreignField: "_id",
          as: "followingDetail",
        },
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "followingId",
          as: "follower",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "follower.followerId",
          foreignField: "_id",
          as: "followerDetail",
        },
      },
    ];
    let result =  await this.collection().aggregate(agg).toArray();
      if (result.length > 0) {
        return result[0];
      } else {
        throw new Error('User not found')
      }
    }
  }
  static async getUserByUsername(username) {
    return await this.collection().findOne({ username: username });
  }
  static async getUserByEmail(email) {
    return await this.collection().findOne({ email: email });
  }
  static async getUserById(id) {
    const agg = [
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "followerId",
          as: "following",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "following.followingId",
          foreignField: "_id",
          as: "followingDetail",
        },
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "followingId",
          as: "follower",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "follower.followerId",
          foreignField: "_id",
          as: "followerDetail",
        },
      },
    ];
    const result = await this.collection().aggregate(agg).toArray();
    if (result.length === 0) throw new Error("User not found");
    const finalResult = result[0];
    return finalResult;
  }
  static async create(newUser) {
    if (!newUser.username) throw new Error("Username is required");
    const checkUsername = await this.getUserByUsername(newUser.username);
    if (checkUsername) throw new Error("Username already exists");
    if (!newUser.email) throw new Error("Email is required");
    const checkEmail = await this.getUserByEmail(newUser.email);
    if (checkEmail) throw new Error("Email already exists");
    const emailValidity = validateEmail(newUser.email);
    if (!emailValidity) throw new Error("Email must be in email format");
    if (!newUser.password) throw new Error("Password is required");
    if (newUser.password.length < 5)
      throw new Error("Password length minimum 5 characters");
    const hash = hashPassword(newUser.password);
    newUser.password = hash;
    const result = await this.collection().insertOne(newUser);
    return newUser;
  }
}

module.exports = User;
