import { mutation } from './mutation';

it('builds top level mutation', () => {
  const schemaTypes = [
    {
      query: '',
      mutation: 'something(name: String!) : Something!',
      type: '',
      resolvers: {},
    },
  ];

  const topQuery = mutation(schemaTypes);

  expect(topQuery).toMatchInlineSnapshot(`
    "type Mutation {
        something(name: String!) : Something!
      }"
  `);
});
