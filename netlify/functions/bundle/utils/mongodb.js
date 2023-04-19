const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

module.exports.createStore = () => {
  const uri = "mongodb+srv://rlynjb:ikwiw@cluster0.shsvqzj.mongodb.net/?retryWrites=true&w=majority";

  const db = async() => {
    return await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  };

  db()
    .then(() => {
      console.log('🎉 Connected to MongoDB!');
    })
    .catch((error) => {
      console.error(error);
    });

  const users = mongoose.model("User", {
    id: {
      type: mongoose.Schema.Types.String,
      index: { unique: true },
      default: () => nanoid(7),
    },
    createdAt: {
      type: mongoose.Schema.Types.Date
    },
    updatedAt: {
      type: mongoose.Schema.Types.Date
    },
    email: {
      type: mongoose.Schema.Types.String
    },
    token: {
      type: mongoose.Schema.Types.String
    }
  });

  const trips = mongoose.model("Trip", {
    id: {
      type: mongoose.Schema.Types.String,
      index: { unique: true },
      default: () => nanoid(7),
    },
    createdAt: {
      type: mongoose.Schema.Types.Date
    },
    updatedAt: {
      type: mongoose.Schema.Types.Date
    },
    launchId: {
      type: mongoose.Schema.Types.String
    },
    userId: {
      type: mongoose.Schema.Types.String
    }
  });

  return { users, trips };
};


// ref: https://www.koyeb.com/tutorials/deploy-a-graphql-api-with-mongodb-atlas-and-apollo-server-on-koyeb#create-a-mongo-db-database-using-mongo-atlas