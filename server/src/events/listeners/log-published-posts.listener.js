// server/src/events/listeners/log-published-posts.listener.js
//
// The first, deliberately trivial listener — proves the pattern works
// end-to-end. Real listeners can be added later without modifying
// PostService.publish() again.

import { EventBus } from "../event-bus.js";

EventBus.on("post.published", (payload) => {
  console.log("[event] post.published:", payload);
});