import { IResolvers } from 'apollo-server-cloudflare';
import { SchemaType } from '../type';
import { GraphQLContext } from '../../graphql';

const type = `
  """
  Echo service used for basic testing
  """
  type Echo {
    back: String!
  }
`;

const query = `
  echo(sound: String!) : Echo
`;

const mutation = '';

const resolvers: IResolvers<any, GraphQLContext> = {
  Query: {
    echo: async (_parents, args, _context, _info) => {
      const { sound } = args;
      return {
        back: `${sound}...${sound}...`,
      };
    },
  },
};

export const Echo: SchemaType = {
  type,
  query,
  mutation,
  resolvers,
};
