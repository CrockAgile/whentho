import { expect } from 'chai';
import { handler } from './handler';

it('handles request', async () => {
  const { status, body } = await handler();
  expect(status).equals(200);
  expect(JSON.parse(body)).deep.equals({ hello: 'when tho?' });
});
