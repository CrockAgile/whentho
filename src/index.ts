import { CloudflareKVStorageClient } from './storage';
import { Responder } from './responder';
import { enableCors } from './cors';

const storage = new CloudflareKVStorageClient();
const responder = new Responder(storage);

addEventListener('fetch', event => {
  const { request } = event;
  const response = responder.getResponse(request);
  const responseCors = enableCors(response);
  event.respondWith(responseCors);
});
