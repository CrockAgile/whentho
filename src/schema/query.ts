import { SchemaType } from './type';

export function query(schemaTypes: SchemaType[]): string {
  const queries = schemaTypes.map(m => m.query);
  return `type Query {
    ${queries.join('\n')}
  }`.trim();
}
