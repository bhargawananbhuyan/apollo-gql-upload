const { createSchema, createYoga } = require("graphql-yoga");
const path = require("path");
const fs = require("fs");
const express = require("express");

const schema = createSchema({
  typeDefs: /* GraphQL */ `
    scalar File

    type Query {
      hello: String!
    }

    type UploadResponse {
      url: String!
    }

    type Mutation {
      singleUpload(file: File!): UploadResponse!
    }
  `,
  resolvers: {
    Query: {
      hello: () => "hello world!",
    },
    Mutation: {
      singleUpload: async (_, { file }) => {
        const stream = file.stream();
        await fs.promises.writeFile(
          path.join(__dirname, `public/images/${file.name}`),
          stream
        );
        return { url: `http://localhost:4000/images/${file.name}` };
      },
    },
  },
});

const yoga = createYoga({ schema });

// to serve static assets to frontend, you need express
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use("/graphql", yoga);

app.listen(4000, () => {
  console.info("Server is running on http://localhost:4000");
});
