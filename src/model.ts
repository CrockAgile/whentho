import { IResolvers } from 'apollo-server-cloudflare';

export interface Model {
  query: string;
  mutation: string;
  type: string;
  resolvers: IResolvers<any, any>;
}
