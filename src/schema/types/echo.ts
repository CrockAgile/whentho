import { IResolvers } from 'apollo-server-cloudflare';
import { SchemaType } from '../type';
import { GraphQLContext } from '../../graphql';

const schema = `
  """
  Echo service used for basic testing
  """
  type Echo {
    back: String!
  }

  type Query {
    echo(sound: String!) : Echo
  }
`;

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
  schema,
  resolvers,
};
