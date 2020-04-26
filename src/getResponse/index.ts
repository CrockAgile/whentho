import { handler } from '../handler';
import { schema } from '../schema';
import { GraphQLHandler } from '../graphql';

const graphqlHandler = new GraphQLHandler(schema);

export async function getResponse(request: Request): Promise<Response> {
  const url = new URL(request.url);
  try {
    if (url.pathname === '/') {
      return graphqlHandler.handler(request);
    } else if (url.pathname === '/when') {
      return handler(request);
    } else {
      return new Response('Not found', { status: 404 });
    }
  } catch (err) {
    return new Response('Something went wrong', { status: 500 });
  }
}
