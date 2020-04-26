import { handler } from './handler';

it('handles request', async () => {
  const response = await handler({} as Request);
  expect(response.status).toEqual(200);
  const body = await response.json();
  expect(body).toEqual({ hello: 'when tho?!' });
});
