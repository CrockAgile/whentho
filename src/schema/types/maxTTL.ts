import { IResolvers } from 'apollo-server-cloudflare';
import { SchemaType } from '../type';
import { GraphQLContext } from '../../graphql';

const type = `
`;

const query = `
  maxTTL() : Int!
`;

const mutation = '';

const resolvers: IResolvers<any, GraphQLContext> = {
  Query: {
    maxTTL: (_parents, args, { model }, _info) => {
      return model.getMaxTTL;
    },
  },
};

export const Echo: SchemaType = {
  type,
  query,
  mutation,
  resolvers,
};
