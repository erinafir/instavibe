const Follow = require("../models/Follow");

const typeDefs = `#graphql
    type Follow {
        _id: ID
        followingId: String
        followerId: String
        createdAt: String
        updatedAt: String
    }

    input newFollow{
      followingId: String
    }

    type Query {
        follows: [Follow]
    }

    type Mutation {
      newFollow(newFollow: newFollow): String
    }
`;

const resolvers = {
  Query: {
    follows: async (_, __, { auth }) => {
      auth();
      const allFollowers = await Follow.getAllFollows();
      return allFollowers;
    },
  },
  Mutation: {
    newFollow: async (_, args, { auth }) => {
      auth();
      const data = { ...args.newFollow };
      const { _id } = auth();
      if (data.followingId === _id) throw new Error("Cannot follow self");
      const result = await Follow.addFollow(data, _id);
      if (result.acknowledged) {
        return "Success follow!";
      }
    },
  },
};

module.exports = { typeDefs, resolvers };
