import mongoose from "mongoose";

console.log('startup 4. utils - mongodb')

export const createStore = () => {
  console.log('4. createMongoDBStore')
  const uri = "mongodb+srv://rlynjb:ikwiw@cluster0.shsvqzj.mongodb.net/?retryWrites=true&w=majority";

  const db = async() => {
    console.log('4. db')
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
      auto: true,
      set: (val) => val.toString()
    },
    createdAt: Date,
    updatedAt: Date,
    email: String,
    token: String
  });

  const trips = mongoose.model("Trip", {
    id: {
      type: mongoose.Types.ObjectId,
      auto: true,
      set: (val) => val.toString()
    },
    createdAt: Date,
    updatedAt: Date,
    launchId: Number,
    userId: Number
  });

  return { users, trips };
};


// ref: https://www.koyeb.com/tutorials/deploy-a-graphql-api-with-mongodb-atlas-and-apollo-server-on-koyeb#create-a-mongo-db-database-using-mongo-atlas