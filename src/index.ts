import { getResponse } from './getResponse';
import { enableCors } from './cors';

addEventListener('fetch', event => {
  const { request } = event;
  const response = getResponse(request);
  const responseCors = enableCors(response);
  event.respondWith(responseCors);
});
