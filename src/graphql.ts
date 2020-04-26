import { GraphQLSchema } from 'graphql';
import * as ApolloCore from 'apollo-server-core';

export class GraphQLHandler {
  private schema: GraphQLSchema;
  constructor(schema: GraphQLSchema) {
    this.schema = schema;
  }
  async handler(req: Request): Promise<Response> {
    try {
      const query = await req.json();
      const options = { schema: this.schema };
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
