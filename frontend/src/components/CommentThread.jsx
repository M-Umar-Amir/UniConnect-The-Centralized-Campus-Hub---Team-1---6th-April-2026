import { useState } from "react";
import LikeButton from "./LikeButton";

function CommentNode({ comment, depth = 0, onLike, onReply, onReport, onDelete }) {
  return (
    <div className="comment-node" style={{ marginLeft: `${depth * 18}px` }}>
      <p className="comment-author">{comment.author}</p>
      <p>{comment.text}</p>
      <div className="comment-actions">
        <LikeButton count={comment.likes} liked={comment.liked} onToggle={() => onLike?.(comment)} />
        <button onClick={() => onReply?.(comment)}>Reply</button>
        <button onClick={() => onReport?.(comment)}>Report</button>
        <button onClick={() => onDelete?.(comment)}>Delete</button>
      </div>
      {comment.replies?.slice(0, 3).map((reply) => (
        <CommentNode
          key={reply.id}
          comment={reply}
          depth={1}
          onLike={onLike}
          onReply={onReply}
          onReport={onReport}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default function CommentThread({ comments = [], onLoadMore, ...handlers }) {
  const [visible, setVisible] = useState(5);
  const shown = comments.slice(0, visible);

  return (
    <section>
      {shown.map((comment) => (
        <CommentNode key={comment.id} comment={comment} {...handlers} />
      ))}
      {visible < comments.length && (
        <button
          onClick={() => {
            setVisible((v) => v + 5);
            onLoadMore?.();
          }}
        >
          Load more
        </button>
      )}
    </section>
  );
}
