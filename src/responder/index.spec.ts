import { MemoryStorageClient } from '../storage';
import { Responder } from './index';

describe('Responder', () => {
  const storage = new MemoryStorageClient();
  const responder = new Responder(storage);
  it('handles graphql', async () => {
    const sound = 'Hello';
    const query = JSON.stringify({
      query: `{ echo(sound: \"${sound}\") { back } }`,
    });
    const request = new Request('http://localhost/', {
      method: 'POST',
      body: query,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const response = await responder.getResponse(request);
    expect(response.status).toEqual(200);

    const {
      data: {
        echo: { back },
      },
    } = await response.json();
    expect(back).toMatchInlineSnapshot(`"Hello...Hello..."`);
  });
});
