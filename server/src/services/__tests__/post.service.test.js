// server/src/services/__tests__/post.service.test.js

import { jest } from "@jest/globals";

const mockPostRepository = {
  createWithTags: jest.fn(),
  searchPublished: jest.fn()
};

const mockEventBus = {
  emit: jest.fn()
};

jest.unstable_mockModule(
  "../../repositories/post.repository.js",
  () => ({
    PostRepository: mockPostRepository
  })
);

jest.unstable_mockModule(
  "../../events/event-bus.js",
  () => ({
    EventBus: mockEventBus
  })
);

const { PostService } =
  await import("../post.service.js");

beforeEach(() => {
  jest.clearAllMocks();
});

test(
  "publish() creates a PUBLISHED post and emits post.published",
  async () => {
    mockPostRepository.createWithTags.mockResolvedValue({
      id: "p1",
      title: "Hello",
      status: "PUBLISHED"
    });

    const post = await PostService.publish({
      authorId: "u1",
      title: "Hello",
      body: "World"
    });

    expect(post.status).toBe("PUBLISHED");

    expect(mockEventBus.emit).toHaveBeenCalledWith(
      "post.published",
      expect.objectContaining({
        postId: "p1"
      })
    );
  }
);

test(
  "publish() rejects an empty title",
  async () => {
    await expect(
      PostService.publish({
        authorId: "u1",
        title: "",
        body: "World"
      })
    ).rejects.toThrow();
  }
);

// added tests for search

test(
  "search() returns matching posts for a valid query",
  async () => {
    mockPostRepository.searchPublished.mockResolvedValue({
      posts: [
        {
          id: "p1",
          title: "On Modularity"
        }
      ],
      hasMore: false
    });

    const result = await PostService.search({
      query: "modularity"
    });

    expect(result.posts).toHaveLength(1);
    expect(result.posts[0].title).toBe("On Modularity");
    expect(result.hasMore).toBe(false);
  }
);

test(
  "search() uses page 1 and pageSize 10 by default",
  async () => {
    mockPostRepository.searchPublished.mockResolvedValue({
      posts: [],
      hasMore: false
    });

    await PostService.search({
      query: "design"
    });

    expect(
      mockPostRepository.searchPublished
    ).toHaveBeenCalledWith({
      query: "design",
      page: 1,
      pageSize: 10
    });
  }
);

test(
  "search() passes a custom page number",
  async () => {
    mockPostRepository.searchPublished.mockResolvedValue({
      posts: [],
      hasMore: false
    });

    await PostService.search({
      query: "architecture",
      page: 2
    });

    expect(
      mockPostRepository.searchPublished
    ).toHaveBeenCalledWith({
      query: "architecture",
      page: 2,
      pageSize: 10
    });
  }
);

test(
  "search() passes a custom pageSize",
  async () => {
    mockPostRepository.searchPublished.mockResolvedValue({
      posts: [],
      hasMore: true
    });

    const result = await PostService.search({
      query: "software",
      page: 1,
      pageSize: 5
    });

    expect(
      mockPostRepository.searchPublished
    ).toHaveBeenCalledWith({
      query: "software",
      page: 1,
      pageSize: 5
    });

    expect(result.hasMore).toBe(true);
  }
);