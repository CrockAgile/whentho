import { IResolvers } from 'apollo-server-cloudflare';
import { Model } from '../model';

const type = `
  type Community {
    id: ID!
    name: String!
  }
`;

const query = `
  community(id: ID!) : Community
`;

const mutation = '';

const resolvers: IResolvers<any, any> = {
  Query: {
    community: async (_parents, args, _context, _info) => {
      const { id } = args;
      return {
        id,
        name: `${id} needs a name`,
      };
    },
  },
};

export const Community: Model = {
  type,
  query,
  mutation,
  resolvers,
};
