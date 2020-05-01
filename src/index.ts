import { CloudflareKVStorageClient } from './storage';
import { MAX_ITEM_TTL } from './model';
import { Responder } from './responder';
import { enableCors } from './cors';

const storage = new CloudflareKVStorageClient(MAX_ITEM_TTL);
const responder = new Responder(storage);

addEventListener('fetch', event => {
  const { request } = event;
  const response = responder.getResponse(request);
  const responseCors = enableCors(response);
  event.respondWith(responseCors);
});
