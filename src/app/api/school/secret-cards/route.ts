import { getSecretCards } from '@/lib/school/api';
import { apiSuccess, withErrorHandling } from '@/lib/api-errors';

export const runtime = 'nodejs';

export const GET = withErrorHandling(async () => {
  const cards = await getSecretCards();
  return apiSuccess({ cards });
}, 'get-secret-cards');
