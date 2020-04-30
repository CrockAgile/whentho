import { SchemaType } from './type';

export function mutation(schemaTypes: SchemaType[]): string {
  const mutations = schemaTypes.map(m => m.mutation);
  return `type Mutation {
    ${mutations.join('\n')}
  }`.trim();
}
