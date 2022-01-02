import { ApolloClient, InMemoryCache } from '@apollo/client'

const keystoneClient = new ApolloClient({
  uri: 'http://localhost:3001/api/graphql',
  cache: new InMemoryCache(),
})

export default keystoneClient
