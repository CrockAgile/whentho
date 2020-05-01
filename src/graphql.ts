import { GraphQLSchema } from 'graphql';
import * as ApolloCore from 'apollo-server-core';
import { ModelAPI } from './model';

export interface GraphQLContext {
  model: ModelAPI;
}

export class GraphQLHandler {
  private schema: GraphQLSchema;
  private context: GraphQLContext;
  constructor(schema: GraphQLSchema, model: ModelAPI) {
    this.schema = schema;
    this.context = { model };
  }
  async handler(req: Request): Promise<Response> {
    try {
      const query = await req.json();
      const options = { schema: this.schema, context: this.context };
      const queryResponse = await ApolloCore.runHttpQuery([req], {
        options,
        method: req.method,
        query,
        // apollo server has bad polyfill of Request object with non-standard extensions
        request: req as any,
      });

      const { graphqlResponse, responseInit } = queryResponse;
      const response = new Response(graphqlResponse, responseInit);
      return response;
    } catch (err) {
      return new Response(err.message, {
        status: err.statusCode,
        headers: err.headers,
      });
    }
  }
}
