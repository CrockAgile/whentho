import { GraphQLSchema } from 'graphql';
import { gql, makeExecutableSchema } from 'apollo-server-cloudflare';
import { SchemaType } from './type';
import { query } from './query';
import { mutation } from './mutation';

export { SCHEMA_TYPES } from './types';

export function schema(schemaTypes: SchemaType[]): GraphQLSchema {
  const topQuery = query(schemaTypes);
  const topMutation = mutation(schemaTypes);
  const resolvers = schemaTypes.map(m => m.resolvers);
  const types = schemaTypes.map(m => m.type).join('\n');

  const all = `
  ${types}
  ${topQuery}
  ${topMutation}
  `;

  const typeDefs = gql(all);

  return makeExecutableSchema({ typeDefs, resolvers });
}
