import { IResolvers } from 'apollo-server-cloudflare';
import { SchemaType } from '../type';
import { GraphQLContext } from '../../graphql';
import { uuid } from 'uuidv4';
import * as model from '../../model';

const schema = `
  """
  A meeting with a constant start, end, and interval.
  Provides the constant unique identifier which scopes all other resources.
  """
  type Meeting {
    id: ID!
    interval: Int!
    start: Int!
    end: Int!
    name: String
    votes: [Vote!]!
  }

  type Query {
    meeting(id: ID!) : Meeting
  }

  type Mutation {
    meeting(start: Int!, end: Int!, interval: Int!, name: String): Meeting!
  }
`;

const resolvers: IResolvers<any, GraphQLContext> = {
  Query: {
    meeting: async (_parents, args, { model }, _info) => {
      const { id } = args;
      const meetings = await model.getMeetingVotes([id]);
      return meetings.length > 0 ? meetings[0] : null;
    },
  },
  Mutation: {
    meeting: async (_parents, args, { model }, _info) => {
      const { name, start, end, interval } = args;
      const meeting: model.Meeting = {
        kind: 'meeting',
        name,
        id: uuid(),
        start,
        end,
        interval,
      };
      await model.createMeeting(meeting);
      return { ...meeting, votes: [] };
    },
  },
};

export const Meeting: SchemaType = {
  schema,
  resolvers,
};
