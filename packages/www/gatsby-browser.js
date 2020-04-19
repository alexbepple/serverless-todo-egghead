const wrapRootElement = require('./wrap-root-element')
const React = require('react')
const {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache,
} = require('@apollo/client')
const netlifyIdentity = require('netlify-identity-widget')
const { setContext } = require('apollo-link-context')

const httpLink = new HttpLink({
  uri: 'https://serverless-todo-egghead.netlify.app/.netlify/functions/graphql',
})

const authLink = setContext((_, { headers }) => {
  const user = netlifyIdentity.currentUser()
  const token = user.token.access_token
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
})

exports.wrapRootElement = (props) => (
  <ApolloProvider client={apolloClient}>
    {wrapRootElement(props)}
  </ApolloProvider>
)
