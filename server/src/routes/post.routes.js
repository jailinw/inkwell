// server/src/routes/post.routes.js
//
// Wires PostService's publish() and listPublished() to
// the API contract's POST /api/posts and GET /api/posts (Lecture 4).
// Same thin-route discipline as auth.routes.js: no business
// rules here.

import { Router } from "express";
import { PostService } from "../services/post.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// server/src/routes/post.routes.js — AFTER (hardened)
router.post("/posts", requireAuth, async (req, res, next) => {
  try {
    // Never trust client-supplied identity fields — derive
    // authorId from the authenticated request, not the request body.
    const post = await PostService.publish({
      ...req.body,
      authorId: req.user.id, // set by requireAuth middleware from the verified JWT
    });

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
});

router.get("/posts", async (req, res, next) => {
  try {
    const page = Number(req.query.page ?? 1);
    const pageSize = Number(req.query.pageSize ?? 10);
    const { search } = req.query;

    // Workshop 15 exercise: limit pageSize to reduce the
    // Denial of Service risk from oversized feed requests.
    const MAX_PAGE_SIZE = 50;

    if (
      !Number.isSafeInteger(page) ||
      page < 1 ||
      !Number.isSafeInteger(pageSize) ||
      pageSize < 1 ||
      pageSize > MAX_PAGE_SIZE
    ) {
      return res.status(400).json({
        error: {
          code: "INVALID_PAGINATION",
          message:
            `page must be a positive integer and pageSize must be between 1 and ${MAX_PAGE_SIZE}.`
        }
      });
    }

    const result = search
      ? await PostService.search({
          query: search,
          page,
          pageSize
        })
      : await PostService.listPublished({
          page,
          pageSize
        });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

export default router;