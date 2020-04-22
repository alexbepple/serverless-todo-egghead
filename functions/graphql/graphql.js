const { ApolloServer, gql } = require('apollo-server-lambda')
const jwt = require('jsonwebtoken')
const faunadb = require('faunadb')
const q = faunadb.query

const client = new faunadb.Client({ secret: process.env.FAUNA })
const todos = q.Collection('todos')

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

const resolvers = {
  Query: {
    todos: async (parent, args, context) => {
      const { userId } = context
      if (userId) {
        const results = await client.query(
          q.Paginate(q.Match(q.Index('todos_by_user'), userId))
        )
        return results.data.map(([ref, text, done]) => ({
          id: ref.id,
          text,
          done,
        }))
      }
      return []
    },
  },
  Mutation: {
    addTodo: async (_, { text }, { userId }) => {
      if (!userId) {
        throw new Error('Must be authenticated to create todos')
      }
      const result = await client.query(
        q.Create(todos, {
          data: {
            text,
            done: false,
            owner: userId,
          },
        })
      )
      return { ...result, id: result.ref.id }
    },
    toggleTodoDone: async (_, { id }, { userId }) => {
      if (!userId) {
        throw new Error('Must be authenticated to toggle todos')
      }
      const result = await client.query(
        q.Update(q.Ref(todos, id), {
          data: { done: true },
        })
      )
      return { ...result, id: result.ref.id }
    },
  },
}

const getUser = (token) => {
  try {
    if (token) {
      return jwt.decode(token)
    }
    return null
  } catch (err) {
    return null
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event }) => {
    const tokenWithBearer = event.headers.authorization || ''
    const token = tokenWithBearer.split(' ')[1]
    const user = getUser(token)

    if (user) {
      console.log({ user })
      return { userId: user.sub }
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
