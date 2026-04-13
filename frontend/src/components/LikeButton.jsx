import { useState } from "react";

export default function LikeButton({ count = 0, liked = false, onToggle }) {
  const [optimisticLiked, setOptimisticLiked] = useState(liked);
  const [optimisticCount, setOptimisticCount] = useState(count);

  async function handleToggle() {
    const nextLiked = !optimisticLiked;
    const nextCount = optimisticCount + (nextLiked ? 1 : -1);

    setOptimisticLiked(nextLiked);
    setOptimisticCount(nextCount);

    try {
      await onToggle?.(nextLiked);
    } catch (error) {
      setOptimisticLiked((prev) => !prev);
      setOptimisticCount((prev) => prev + (nextLiked ? -1 : 1));
    }
  }

  return (
    <button className={`like-button ${optimisticLiked ? "active" : ""}`} onClick={handleToggle}>
      <span>{optimisticLiked ? "♥" : "♡"}</span>
      <span>{optimisticCount}</span>
    </button>
  );
}
