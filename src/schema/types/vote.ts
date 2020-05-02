import { IResolvers } from 'apollo-server-cloudflare';
import { SchemaType } from '../type';
import { GraphQLContext } from '../../graphql';
import * as model from '../../model';

const type = `
  """
  A vote for a meeting time.
  Uniquely identified by name and time.
  """
  type Vote {
    meetingId: ID!
    name: String!
    time: Int!
  }
`;

const query = `
`;

const mutation = `
  vote(meetingId: ID!, name: String!, time: Int!) : Vote
  deleteVote(meetingId: ID!, name: String!, time: Int!) : Vote
`;

const resolvers: IResolvers<any, GraphQLContext> = {
  Query: {},
  Mutation: {
    vote: async (_parents, args, { model }, _info) => {
      const { meetingId, name, time } = args;
      const vote: model.Vote = {
        kind: 'vote',
        name,
        meetingId,
        time,
      };
      await model.vote([vote]);
      return vote;
    },
    deleteVote: async (_parents, args, { model }, _info) => {
      const { meetingId, name, time } = args;
      const vote: model.Vote = {
        kind: 'vote',
        name,
        meetingId,
        time,
      };
      await model.deleteVote([vote]);
      return vote;
    },
  },
};

export const Vote: SchemaType = {
  type,
  query,
  mutation,
  resolvers,
};
