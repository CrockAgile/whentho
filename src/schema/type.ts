import { IResolvers } from 'apollo-server-cloudflare';

export interface SchemaType {
  schema: string;
  resolvers: IResolvers<any, any>;
}
