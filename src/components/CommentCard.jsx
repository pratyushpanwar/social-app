import { useSelector } from 'react-redux';
import { Trash2 } from 'lucide-react';
import { useDeleteComment } from '../hooks/useComments';
import { timeAgo } from '../utils/formDate';
import { useState } from 'react';

function CommentCard({ comment, postId }) {
  const [error, setError] = useState(true)
  const currentUser = useSelector(state => state.auth.user);
  const deleteComment = useDeleteComment(postId);

  const author = comment.author || comment.owner || {};
  const isOwn  = currentUser?._id === author.account._id;
  
  
  return (
    <div className="flex items-start gap-3 py-3 border-b border-base-200">

      {/* Avatar */}
      {error && author.account.avatar?.url ? (
        <img
          src={author.account.avatar.url}
          alt={author.account.username}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          onError={() => setError(false)}
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-primary-content text-xs font-bold">
            {author.account.username?.[0]?.toUpperCase()}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold">{author.username}</span>
          <span className="text-xs text-base-content/40">
            {timeAgo(comment.createdAt)}
          </span>
        </div>
        <p className="text-sm text-base-content/80 whitespace-pre-wrap">
          {comment.content}
        </p>
      </div>

      {/* Delete — only visible on own comments */}
      {isOwn && (
        <button
          className="text-base-content/30 hover:text-error transition-colors flex-shrink-0 mt-0.5"
          onClick={() => deleteComment.mutate(comment._id)}
          disabled={deleteComment.isPending}
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}

export default CommentCard;