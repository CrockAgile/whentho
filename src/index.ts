import { HandlerResponse } from './response';
import { handler } from './handler';

async function mapResponse(
  response: Promise<HandlerResponse>,
): Promise<Response> {
  const { body, status } = await response;
  return new Response(body, { status });
}

addEventListener('fetch', event => {
  const response = handler(event.request);
  event.respondWith(mapResponse(response));
});
