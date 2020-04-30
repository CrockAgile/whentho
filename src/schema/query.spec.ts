import { query } from './query';

it('builds top level query', () => {
  const models = [
    {
      query: 'somethingById(id: ID!) : Something',
      mutation: '',
      type: '',
      resolvers: {},
    },
  ];

  const topQuery = query(models);

  expect(topQuery).toMatchInlineSnapshot(`
    "type Query {
        somethingById(id: ID!) : Something
      }"
  `);
});
