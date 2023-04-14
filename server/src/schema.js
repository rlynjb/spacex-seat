/*
Your schema's structure should support the actions that your clients will take. Our example app needs to be able to:

- Fetch a list of all upcoming rocket launches
- Fetch a specific launch by its ID
- Log in the user
- Book a launch for a logged-in user
- Cancel a previously booked launch for a logged-in user
*/

import { gql } from 'apollo-server';
console.log('startup 1. schema')
const typeDefs = gql`
  type Query {
    launches(pageSize: Int, after: String): LaunchConnection!
    launch(id: ID!): Launch
    me: User
  }

  type Mutation {
    bookTrips(launchIds: [ID]!): TripUpdateResponse!
    cancelTrip(launchId: ID!): TripUpdateResponse!
    login(email: String): User
  }

  type TripUpdateResponse {
    success: Boolean!
    message: String
    launches: [Launch]
  }

  """
  Simple wrapper around our list of launches that contains a cursor to the
  last item in the list. Pass this cursor to the launches query to fetch results
  after these.
  """

  type LaunchConnection {
    cursor: String!
    hasMore: Boolean!
    launches: [Launch]!
  }

  type Launch {
    id: ID!
    site: String
    mission: Mission
    rocket: Rocket
    isBooked: Boolean!
  }

  type Rocket {
    id: ID!
    name: String
    type: String
  }
  
  type User {
    id: ID!
    email: String!
    profileImage: String
    trips: [Launch]!
    token: String
  }
  
  type Mission {
    name: String
    missionPatch(size: PatchSize): String
  }

  enum PatchSize {
    SMALL
    LARGE
  }
`;

export {
  typeDefs
}