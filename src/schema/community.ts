import { gql, IResolvers } from 'apollo-server-cloudflare';

export const schema = gql`
  type Query {
    community(id: ID!): Community
  }
  type Community {
    id: ID!
    name: String!
  }
`;

export const resolvers: IResolvers<any, any> = {
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
