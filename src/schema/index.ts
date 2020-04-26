import { makeExecutableSchema } from 'apollo-server-cloudflare';
import * as community from './community';

const typeDefs = [community.schema];

const resolvers = [community.resolvers];

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
