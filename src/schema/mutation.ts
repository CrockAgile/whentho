import { Model } from '../model';

export function mutation(models: Model[]): string {
  const mutations = models.map(m => m.mutation);
  return `type Mutation {
    ${mutations.join('\n')}
  }`.trim();
}
