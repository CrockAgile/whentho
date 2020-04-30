import { getResponse } from './index';

describe('getResponse', () => {
  it('handles graphql', async () => {
    const id = 'Jeff';
    const query = JSON.stringify({
      query: `{ community(id: \"${id}\") { id, name } }`,
    });
    const request = new Request('http://localhost/', {
      method: 'POST',
      body: query,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const response = await getResponse(request);
    expect(response.status).toEqual(200);

    const {
      data: { community },
    } = await response.json();
    expect(community).toEqual({ id, name: `${id} is a community` });
  });
});
