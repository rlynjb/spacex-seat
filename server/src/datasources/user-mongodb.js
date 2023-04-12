import { MongoDataSource } from "apollo-datasource-mongodb";
import isEmail from 'isemail';

class UserAPI extends MongoDataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  initialize({ config }) {
    this.context = config.context;
  }

  async findOrCreateUser({ email: emailArg } = {}) {
    const email = this.context && this.context.user
      ? this.context.user.email
      : emailArg;

    if (!email || !isEmail.validate(email)) return null;

    // since mongoose doesnt have findOrCreate, we'll have to do it manually
    // if theres no user, create one
    const users = await this.store.users.find({ where: { email } });
    if (!users) {
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
      if (res) results.push(res);
    }

    return results;
  }

  async bookTrip({ launchId }) {
    const userId = this.context.user.id;

    // find MONGOOSE equivalent
    const res = await this.store.trips.findOrCreate({
      where: { userId, launchId },
    });
    return res && res.length ? res[0].get() : false;
  }

  async cancelTrip({ launchId }) {
    const userId = this.context.user.id;

    return !!this.store.trips.deleteOne({ where: { userId, launchId } });
  }

  async getLaunchIdsByUser() {
    const userId = this.context.user.id;

    const found = await this.store.trips.find({
      where: { userId },
    });
    return found && found.length
      ? found.map(l => l.dataValues.launchId).filter(l => !!l)
      : [];
  }

  async isBookedOnLaunch({ launchId }) {
    if (!this.context || !this.context.user) return false;
    const userId = this.context.user.id;

    const found = await this.store.trips.find({
      where: { userId, launchId },
    });
    return found && found.length > 0;
  }
}

export {
  UserAPI
}