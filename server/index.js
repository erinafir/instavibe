const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { verifToken } = require("./helper/jwt");

const {
  typeDefs: userTypeDefs,
  resolvers: userResolvers,
} = require("./schemas/users");

const {
  typeDefs: postTypeDefs,
  resolvers: postResolvers
} = require('./schemas/posts')

const {
  typeDefs: followTypeDefs,
  resolvers: followResolvers
} = require('./schemas/follows')

const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
  resolvers: [userResolvers, postResolvers, followResolvers],
  introspection: true
});

startStandaloneServer(server, {
  listen: { port: process.env.PORT || 3000 },
  context: ({ req, res }) => {
    return {
      auth: () => {
        const auth = req.headers.authorization;
        if (!auth) throw new Error("unauthenticated");
        const [bearer, token] = auth.split(" ");
        if (bearer !== "Bearer") throw new Error("invalid token");
        const decode = verifToken(token);
        return decode
      },
    };
  },
}).then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
});
