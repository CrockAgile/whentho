import { HandlerResponse } from './response';

export async function handler(_: Request): Promise<HandlerResponse> {
  const hello = 'when tho?';
  const status = 200;
  const body = JSON.stringify({ hello });
  return { status, body };
}
