import { IResolvers } from 'apollo-server-cloudflare';

export interface SchemaType {
  query: string;
  mutation: string;
  type: string;
  resolvers: IResolvers<any, any>;
}
