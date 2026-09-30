// server/src/events/listeners/count-published-posts.listener.js

import { EventBus } from "../event-bus.js";

let publishedPostCount = 0;

EventBus.on("post.published", () => {
  publishedPostCount += 1;
});

export function getPublishedPostCount() {
  return publishedPostCount;
}