const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const { Schema } = mongoose;

module.exports.createStore = () => {
  const uri = process.env.MONGODB_API;

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

  let users = new Schema({
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

  let trips = new Schema({
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

  mongoose.disconnect();

  return {
    users: mongoose.models.User || mongoose.model('User', users),
    trips: mongoose.models.Trip || mongoose.model('Trip', trips),
  };
};


// ref: https://www.koyeb.com/tutorials/deploy-a-graphql-api-with-mongodb-atlas-and-apollo-server-on-koyeb#create-a-mongo-db-database-using-mongo-atlas