# WhenTho API

The WhenTho API is an anonymous/unauthenticated API for proposing and voting on meeting times.

It should be considered highly experimental because the storage system is unconventional. It uses [Cloudflare KV](https://developers.cloudflare.com/workers/reference/storage) for storage, which is an eventually consistent caching system. Because all operations are only _eventually_ consistent, clients may see inconsistent state. But, it is globally available, and a fun challenge to design around!

- Operations
  - Create meeting
  - Get meeting and all votes
  - Cast vote for time of meeting
  - Rescind vote for time of meeting
- Storage
  - [Cloudflare KV](https://developers.cloudflare.com/workers/reference/storage)
  - Resources are serialized to Key-Value pairs
    - Key: `e60524a5-42e8-4a75-8bcb-4ad4027fb3e7:vote:1586563200#Jeff`
    - Value: `{"end":1586649600,"interval":3600,"start":1586476800,"name":"WOW"}`
