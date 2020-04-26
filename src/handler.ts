export async function handler(_: Request): Promise<Response> {
  const hello = 'when tho?!';
  const status = 200;
  const body = JSON.stringify({ hello });
  return new Response(body, { status });
}
