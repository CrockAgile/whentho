import { Model } from '../model';

export function query(models: Model[]): string {
  const queries = models.map(m => m.query);
  return `type Query {
    ${queries.join('\n')}
  }`.trim();
}
