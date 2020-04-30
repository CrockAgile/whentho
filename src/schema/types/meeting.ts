import { IResolvers } from 'apollo-server-cloudflare';
import { SchemaType } from '../type';

const type = `
  type Meeting {
    id: ID!
    name: String
  }
`;

const query = `
  meeting(id: ID!) : Meeting
`;

const mutation = `
  meeting(name: String): Meeting!
`;

const resolvers: IResolvers<any, any> = {
  Query: {
    meeting: async (_parents, args, _context, _info) => {
      const { id } = args;
      return {
        id,
        name: `${id} is a meeting`,
      };
    },
  },
};

export const Meeting: SchemaType = {
  type,
  query,
  mutation,
  resolvers,
};
