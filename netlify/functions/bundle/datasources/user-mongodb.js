const { MongoDataSource } = require("apollo-datasource-mongodb");
const isEmail = require('isemail');

module.exports = class UserAPI extends MongoDataSource {
  constructor(options) {    
    super(options);
    this.store = options.store;
  }

  initialize(config) {
    this.context = config.context;
  }

  async findOrCreateUser({ email: emailArg } = {}) {
    const email = this.context && this.context.user
      ? this.context.user.user.email
      : emailArg;
    if (!email || !isEmail.validate(email)) return null;

    // since mongoose doesnt have findOrCreate, we'll have to do it manually
    // if theres no user, create one
    let users = await this.store.users.find({ email }).exec();
    if (!users.length) {
      users = await this.store.users.create({ email });
    }
    return users && users[0] ? users[0] : null;
  }

  async bookTrips({ launchIds }) {
    let userId = this.context.user.user.id;
    if (!userId) return;

    let results = [];

    // for each launch id, try to book the trip and add it to the results array
    // if successful
    for (const launchId of launchIds) {
      let res = await this.bookTrip({ launchId });
      if (res) results.push(res);
    }

    return results;
  }

  async bookTrip({ launchId }) {
    let userId = this.context.user.user.id;

    let res = await this.store.trips.find({
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
    const userId = this.context.user.user.id;
    return this.store.trips.deleteMany({ userId, launchId });
  }

  async getLaunchIdsByUser() {
    const userId = this.context.user.user.id;
    const found = await this.store.trips.find({ userId });

    return found && found.length
      ? found.map(l => l.launchId).filter(l => !!l)
      : [];
  }

  async isBookedOnLaunch({ launchId }) {
    if (!this.context || !this.context.user) return false;

    const userId = this.context.user.user.id;
    const found = await this.store.trips.find({ userId, launchId });

    return found && found.length > 0;
  }
}