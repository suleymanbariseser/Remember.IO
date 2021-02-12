const express = require("express");
const bodyParser = require("body-parser");
const { buildSchema } = require("graphql");
const { graphqlHTTP } = require("express-graphql");

// create express app
const app = express();

app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
        type RootQuery {
            events: [String!]!
        }
        type RootMutation {
            createEvent(name: String): String
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: () => {
        return ["Romantic Cooking", "Sailing"];
      },
      createEvent: (args) => {
        const eventName = args.name;
        return eventName;
      },
    },
    graphiql: true,
  })
);
app.listen(5000, () => {
  console.log("Started to listen on port 5000");
});
