const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const { GraphQLUpload, graphqlUploadExpress } = require("graphql-upload");
const { finished } = require("stream/promises");
const path = require("path");
const fs = require("fs");

const typeDefs = gql`
  scalar Upload

  type File {
    url: String!
  }

  type Query {
    hello: String!
  }

  type Mutation {
    singleUpload(file: Upload!): File!
  }
`;

const resolvers = {
  Upload: GraphQLUpload,

  Query: {
    hello: () => "Hello, world!",
  },

  Mutation: {
    singleUpload: async (_, { file }) => {
      const { createReadStream, filename } = await file;
      const stream = createReadStream();
      const out = fs.createWriteStream(
        path.join(__dirname, `public/images/${filename}`)
      );
      stream.pipe(out);
      await finished(out);
      return { url: `http://localhost:4000/images/${filename}` };
    },
  },
};

(async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: false,
    cache: "bounded",
  });

  await server.start();

  const app = express();

  // middlewares
  app.use(graphqlUploadExpress());
  app.use(express.static(path.join(__dirname, "public")));

  server.applyMiddleware({ app });

  await new Promise((resolve) => app.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
})();
