import { handler } from './handler';

addEventListener('fetch', event => {
  const response = handler(event.request);

  event.respondWith(response);
});
