import {ApolloServer} from 'apollo-server';
import {schema} from './schema/schema';
import {context} from './context';

const server = new ApolloServer({schema, context})

server.listen().then(({url}) => {
  console.log(`Apollo Server ready at ${url}`)
})
