import { GraphQLSchema } from 'graphql';
import { gql, makeExecutableSchema } from 'apollo-server-cloudflare';
import { Model } from '../model';
import { query } from './query';
import { mutation } from './mutation';

export function schema(models: Model[]): GraphQLSchema {
  const topQuery = query(models);
  const topMutation = mutation(models);
  const resolvers = models.map(m => m.resolvers);
  const types = models.map(m => m.type).join('\n');

  const all = `
  ${types}
  ${topQuery}
  ${topMutation}
  `;

  const typeDefs = gql(all);

  return makeExecutableSchema({ typeDefs, resolvers });
}
