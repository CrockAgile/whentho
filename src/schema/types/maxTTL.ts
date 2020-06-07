import { IResolvers } from 'apollo-server-cloudflare';
import { SchemaType } from '../type';
import { GraphQLContext } from '../../graphql';

const schema = `
  type Query {
    """
    Get maximum TTL supported by backend. Clients can limit meeting creation times.
    """
    maxTTL() : Int!
  }
`;

const resolvers: IResolvers<any, GraphQLContext> = {
  Query: {
    maxTTL: (_parents, _args, { model }, _info) => {
      return model.getMaxTTL();
    },
  },
};

export const Echo: SchemaType = {
  schema,
  resolvers,
};
