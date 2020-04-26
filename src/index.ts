import { getResponse } from './getResponse';

addEventListener('fetch', event => {
  const { request } = event;
  const response = getResponse(request);
  event.respondWith(response);
});
