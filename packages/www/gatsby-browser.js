const wrapRootElement = require('./wrap-root-element')
const React = require('react')
const {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache,
} = require('@apollo/client')

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri:
      'https://serverless-todo-egghead.netlify.app/.netlify/functions/graphql',
  }),
})

exports.wrapRootElement = (props) => (
  <ApolloProvider client={apolloClient}>
    {wrapRootElement(props)}
  </ApolloProvider>
)
