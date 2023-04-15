import { MongoDataSource } from "apollo-datasource-mongodb";
import isEmail from 'isemail';

console.log('startup 3. datasource - user-mongodb')

class UserAPI extends MongoDataSource {
  constructor(options) {    
    super(options);
    this.store = options.store;
  }

  initialize(config) {
    this.context = config.context;
    console.log('3. config', config)
  }

  async findOrCreateUser({ email: emailArg } = {}) {
    const email = this.context && this.context.user
      ? this.context.user.email
      : emailArg;

    if (!email || !isEmail.validate(email)) return null;

    // since mongoose doesnt have findOrCreate, we'll have to do it manually
    // if theres no user, create one
    const users = await this.store.users.find({ email }).exec();
    if (!users.length) {
      users = await this.store.users.create({ email });
    }

    return users && users[0] ? users[0] : null;
  }

  async bookTrips({ launchIds }) {
    const userId = this.context.user.id;
    if (!userId) return;

    let results = [];

    // for each launch id, try to book the trip and add it to the results array
    // if successful
    for (const launchId of launchIds) {
      const res = await this.bookTrip({ launchId });
      console.log('src/datasources/user-mongodb.js, res', res)
      console.log('userId', userId)
      if (res) results.push(res);
    }

    return results;
  }

  async bookTrip({ launchId }) {
    const userId = this.context.user.id;

    const res = await this.store.trips.find({
      userId, launchId
    }).exec();

    if (!res.length) {
      res = await this.store.trips.create({
        userId, launchId
      });
    }

    return res && res.length ? res[0].get() : false;
  }

  async cancelTrip({ launchId }) {
    const userId = this.context.user.id;
    return !!this.store.trips.deleteMany({ userId, launchId });
  }

  async getLaunchIdsByUser() {
    const userId = this.context.user.id;
    const found = await this.store.trips.find({ userId });

    return found && found.length
      ? found.map(l => l.dataValues.launchId).filter(l => !!l)
      : [];
  }

  async isBookedOnLaunch({ launchId }) {
    if (!this.context || !this.context.user) return false;

    const userId = this.context.user.id;
    const found = await this.store.trips.find({ userId, launchId });

    return found && found.length > 0;
  }
}

export {
  UserAPI
}