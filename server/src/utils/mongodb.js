import mongoose, { Schema } from "mongoose";

export const createMongoDBStore = () => {
  console.log('1) src/utils/mongodb.js')
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
      type: mongoose.Types.ObjectId,
      auto: true
    },
    createdAt: String,
    updatedAt: String,
    email: String,
    token: String
  });

  const trips = mongoose.model("Trip", {
    id: {
      type: mongoose.Types.ObjectId,
      auto: true
    },
    createdAt: String,
    updatedAt: String,
    launchId: Number,
    userId: Number
  });

  return { users, trips };
};


// ref: https://www.koyeb.com/tutorials/deploy-a-graphql-api-with-mongodb-atlas-and-apollo-server-on-koyeb#create-a-mongo-db-database-using-mongo-atlas