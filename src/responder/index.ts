import { handler } from '../handler';
import { schema, SCHEMA_TYPES } from '../schema';
import { GraphQLHandler } from '../graphql';
import { ModelAPI } from '../model';
import { StorageClient } from '../storage';

export class Responder {
  private graphQLHandler: GraphQLHandler;
  constructor(client: StorageClient) {
    const model = new ModelAPI(client);
    const handler = new GraphQLHandler(schema(SCHEMA_TYPES), model);
    this.graphQLHandler = handler;
  }

  async getResponse(request: Request): Promise<Response> {
    const url = new URL(request.url);
    try {
      if (url.pathname === '/') {
        return this.graphQLHandler.handler(request);
      } else if (url.pathname === '/when') {
        return handler(request);
      } else {
        return new Response('Not found', { status: 404 });
      }
    } catch (err) {
      return new Response('Something went wrong', { status: 500 });
    }
  }
}
