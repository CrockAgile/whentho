import { query } from './query';

it('builds top level query', () => {
  const schemaTypes = [
    {
      query: 'somethingById(id: ID!) : Something',
      mutation: '',
      type: '',
      resolvers: {},
    },
  ];

  const topQuery = query(schemaTypes);

  expect(topQuery).toMatchInlineSnapshot(`
    "type Query {
        somethingById(id: ID!) : Something
      }"
  `);
});
