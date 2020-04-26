export async function enableCors(
  responsePromise: Promise<Response>,
): Promise<Response> {
  const response = await responsePromise;
  response.headers.set(
    'Access-Control-Allow-Headers',
    'application/json, Content-type',
  );
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST');
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('X-Content-Type-Options', 'nosniff');

  return response;
}
