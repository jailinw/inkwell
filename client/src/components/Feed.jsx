// client/src/components/Feed.jsx

import {
  useEffect,
  useState
} from "react";

import { Link } from "react-router-dom";
import { PostCard } from "./PostCard";

export function Feed() {
  const [posts, setPosts] =
    useState(null);

  useEffect(() => {
    fetch("/api/posts?page=1")
      .then((res) => res.json())
      .then((data) =>
        setPosts(data.posts)
      );
  }, []);

  if (posts === null) {
    return (
      <p className="text-gray-500">
        Loading posts…
      </p>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          No posts yet.
        </p>

        <Link
          to="/write"
          className="text-indigo-600 underline"
        >
          Write the first one
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-6">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
        />
      ))}
    </ul>
  );
}