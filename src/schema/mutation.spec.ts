import { mutation } from './mutation';

it('builds top level mutation', () => {
  const models = [
    {
      query: '',
      mutation: 'something(name: String!) : Something!',
      type: '',
      resolvers: {},
    },
  ];

  const topQuery = mutation(models);

  expect(topQuery).toMatchInlineSnapshot(`
    "type Mutation {
        something(name: String!) : Something!
      }"
  `);
});
