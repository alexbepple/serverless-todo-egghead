const { ApolloServer, gql } = require('apollo-server-lambda')

const typeDefs = gql`
  type Query {
    todos: [Todo]!
  }
  type Todo {
    id: ID!
    text: String!
    done: Boolean!
  }
  type Mutation {
    addTodo(text: String!): Todo
    toggleTodoDone(id: ID!): Todo
  }
`

const todoById = {}
let todoIndex = 0

const resolvers = {
  Query: {
    todos: (parent, args, { user }) => {
      if (user) {
        return Object.values(todoById)
      } else {
        return []
      }
    },
  },
  Mutation: {
    addTodo: (_, { text }) => {
      todoIndex++
      const id = `key-${todoIndex}`
      todoById[id] = { id, text, done: false }
      return todoById[id]
    },
    toggleTodoDone: (_, { id }) => {
      todoById[id].done = !todoById[id].done
      return todoById[id]
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ context }) => {
    const jwt = context.clientContext.user
    if (jwt) {
      console.log({ jwt })
      return { user: jwt.sub }
    } else {
      return {}
    }
  },
  playground: true,
  introspection: true,
})

exports.handler = server.createHandler({
  cors: { origin: '*', credentials: true },
})
