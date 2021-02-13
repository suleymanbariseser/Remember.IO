const express = require("express");
const bodyParser = require("body-parser");
const { buildSchema } = require("graphql");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");

const NoteFolder = require("./models/NoteFolder");

// create express app
const app = express();

app.use(bodyParser.json());
const events = [];
app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
        type NoteFolder {
          _id: ID!
          title: String!
          description: String!
          created_date: Float!
          last_modified_date: Float!
        }
        input InputNoteFolder {
          title: String!
          description: String!
        }
        type RootQuery {
            noteFolders: [NoteFolder!]!
        }
        type RootMutation {
            createNoteFolder(noteFolder: InputNoteFolder): NoteFolder
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      noteFolders: () => {
        return NoteFolder.find()
          .then((result) => {
            return result.map((item) => {
              return { ...item._doc };
            });
          })
          .catch((err) => {
            throw err;
          });
      },
      createNoteFolder: (args) => {
        const query = new NoteFolder({
          title: args.noteFolder.title,
          description: args.noteFolder.description,
          created_date: new Date().getTime(),
          last_modified_date: new Date().getTime(),
        });
        return query
          .save()
          .then((result) => {
            console.log(result);
            return { ...result._doc };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
        return query;
      },
    },
    graphiql: true,
  })
);
mongoose
  .connect(
    `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@rememberio.i4zzf.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("connection is established with database");
    return app.listen(5000, () => {
      console.log("Server is started to listen on port 5000");
    });
  })
  .catch((err) => console.log(err));
