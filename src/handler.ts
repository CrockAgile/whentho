export async function handler(_: Request): Promise<Response> {
  const hello = 'world';
  const status = 200;
  return new Response(JSON.stringify({ hello }), { status });
}
