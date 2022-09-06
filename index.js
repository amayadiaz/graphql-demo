import { ApolloServer, UserInputError, gql } from "apollo-server"
import {
  ApolloServerPluginLandingPageGraphQLPlayground
} from "apollo-server-core";
import { v4 as uuidv4 } from 'uuid';

const players = [
  {
    name: 'Stephen Curry',
    team: 'Golden State Warriors',
    rings: 4,
    id: '7b252f3f-dda1-4d1e-9108-bb36bacdd441',
    bornCity: 'Akron, Ohio', 
    bornCountry: 'USA'
  },
  {
    name: 'Michael Jordan',
    rings: 6,
    id: 'ef51e744-10c3-4b0f-8f1f-ef387fed1de2',
    bornCity: 'Cumberland Hospital', 
    bornCountry: 'USA'
  }, 
  {
    name: 'Luca Doncic',
    team: 'Dallas Mavericks',
    rings: 0,
    id: 'e19214ce-02e2-43c8-b9e7-d7a2396aac67',
    bornCity: 'Ljubljana',
    bornCountry: 'Slovenia'
  }
]

const typeDefs = gql`

  type BornPlace {
    city: String!,
    country: String!
  }

  type Player {
    name: String!
    team: String
    rings: Int!
    isNbaChampion: Boolean!
    bornPlace: BornPlace!
    id: ID!
  }

  type Query {
    playersCount: Int!
    allPlayers: [Player]!
    findPlayer(name: String!): Player
  }

  type Mutation {
    addPlayer(
      name: String!
      team: String
      rings: Int!
      bornCity: String!
      bornCountry: String!
    ): Player
  }
`

const resolvers = {
  Query: {
    playersCount: () => players.length,
    allPlayers: () => players,
    findPlayer: (root, args) => {
      const { name } = args
      return players.find(players => players.name === name)
    }
  },
  Mutation: {
    addPlayer: (root, args) => {
      console.log(players);
      if (players.find(person => person.name === args.name)) {
        throw new UserInputError('Name must be unique', {
          invalidArgs: args.name
        })
      }
      const player = { ...args, id: uuidv4() }
      players.push(player)
      return player
    }
  },
  Player: {
    isNbaChampion: (root) => root.rings > 0,
    bornPlace: (root) =>  {
      return {
        city: root.bornCity,
        country: root.bornCountry
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
