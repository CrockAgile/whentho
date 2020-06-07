import { GraphQLSchema } from 'graphql';
import { mergeSchemas } from 'apollo-server-cloudflare';
import { SchemaType } from './type';

export { SCHEMA_TYPES } from './types';

export function schema(schemaTypes: SchemaType[]): GraphQLSchema {
  const resolvers = schemaTypes.map(m => m.resolvers);
  return mergeSchemas({ schemas: schemaTypes.map(s => s.schema), resolvers });
}
