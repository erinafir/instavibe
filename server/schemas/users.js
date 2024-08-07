const { comparePassword } = require("../helper/bcrypt");
const { signToken } = require("../helper/jwt");
const User = require("../models/User");

const typeDefs = `#graphql
  type User {
    _id: ID
    name: String
    username: String
    email: String
    password: String
    following: [Follow]
    followingDetail: [FollowingFollower]
    follower: [Follow]
    followerDetail: [FollowingFollower]
  }

  type FollowingFollower {
    _id: ID
    name: String
    username: String
  }

  input newUser {
    name: String
    username: String
    email: String
    password: String
  }

  input loginUser{
    username: String
    password: String
  }

  type AccessToken{
    accessToken: String
  }

  type Query {
    users: [User]
    userById(_id: String): User
    userLoggedIn: User
    searchUser(name: String, username: String): User
  }

  type Mutation {
    register(user: newUser): User
    login(user: loginUser): AccessToken
  }
`;

const resolvers = {
  Query: {
    users: async (_, __, { auth }) => {
      auth();
      let dataUser = await User.getAllUser();
      return dataUser;
    },
    userById: async (_, args, { auth }) => {
      auth();
      const { _id } = args;
      const result = await User.getUserById(_id);
      return result;
    },
    userLoggedIn: async (_, __, { auth }) => {
      auth();
      const { _id } = auth();
      const result = await User.getUserById(_id);
      return result;
    },
    searchUser: async (_, { name, username }, { auth }) => {
      auth();
      let dataUser;
      if (name) {
        dataUser = await User.searchByNameUsername(name);
      } else if (!name && username) {
        dataUser = await User.searchByNameUsername(undefined, username);
      }
      return dataUser;
    },
  },
  Mutation: {
    register: async (_, args) => {
      const data = { ...args.user };
      const result = await User.create(data);
      return result;
    },
    login: async (_, args) => {
      const { username, password } = args.user;
      const user = await User.getUserByUsername(username);
      if (!user) throw new Error("Username/Password Invalid");
      const checkPass = comparePassword(password, user.password);
      if (!checkPass) throw new Error("Username/Password Invalid");
      const accessToken = signToken({
        _id: user._id,
        username: username,
      });
      const token = {
        accessToken,
      };
      return token;
    },
  },
};

module.exports = { typeDefs, resolvers };
