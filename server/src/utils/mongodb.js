import mongoose from "mongoose";

const createMongoDBStore = () => {
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

  /*
    const users = db.define('user', {
      id: {
        type: SQL.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      createdAt: SQL.DATE,
      updatedAt: SQL.DATE,
      email: SQL.STRING,
      token: SQL.STRING,
    });
  */
  const users = mongoose.model("User", {
    id: Number,
    createdAt: String,
    updatedAt: String,
    email: String,
    token: String
  });

  /*
    const trips = db.define('trip', {
      id: {
        type: SQL.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      createdAt: SQL.DATE,
      updatedAt: SQL.DATE,
      launchId: SQL.INTEGER,
      userId: SQL.INTEGER,
    });
  */
  const trips = mongoose.model("Trip", {
    id: Number,
    createdAt: String,
    updatedAt: String,
    launchId: Number,
    userId: Number
  });

  return { users, trips };
};


export {
  createMongoDBStore
}


// ref: https://www.koyeb.com/tutorials/deploy-a-graphql-api-with-mongodb-atlas-and-apollo-server-on-koyeb#create-a-mongo-db-database-using-mongo-atlas