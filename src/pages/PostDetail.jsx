import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { usePost } from '../hooks/usePost';
import { useComments, useAddComment } from '../hooks/useComments';
import PostCard from '../components/PostCard';
import CommentCard from '../components/CommentCard';
import PostSkeleton from '../components/PostSkeleton';

function PostDetail() {
  const { id } = useParams(); // reads the :id from /post/:id
  const navigate = useNavigate();
  const [comment, setComment] = useState('');

  const { data: post, isLoading: postLoading, isError } = usePost(id);
  const { data: commentsData, isLoading: commentsLoading } = useComments(id);
  const addComment = useAddComment(id);

  const handleAdd = () => {
    if (!comment.trim()) return;
    addComment.mutate(comment, { onSuccess: () => setComment('') });
  };

  if (postLoading) return <PostSkeleton />;

  if (isError)
    return (
      <div className="p-8 text-center">
        <p className="text-base-content/50 mb-3">Post not found.</p>
        <button className="btn btn-sm btn-ghost" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    );

  // handle both { comments: [] } and { data: { comments: [] } }
  const comments = commentsData?.comments ?? commentsData?.data?.comments ?? [];

  return (
    <div>

      {/* Sticky back header */}
      <div className="sticky top-0 bg-base-100/80 backdrop-blur-sm border-b border-base-200 px-4 py-3 flex items-center gap-3 z-10">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm btn-circle"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-bold text-lg">Post</h1>
      </div>

      {/* The post itself — reuse PostCard */}
      <PostCard post={post} />

      {/* Add comment input */}
      <div className="border-b border-base-200 px-4 py-3 flex items-center gap-3">
        <textarea
          className="textarea flex-1 text-sm resize-none border border-base-300 rounded-xl bg-transparent focus:outline-none focus:border-primary placeholder:text-base-content/40"
          placeholder="Add a comment..."
          rows={1}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => {
            // Enter (without Shift) submits
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <button
          className="btn btn-primary btn-sm btn-circle"
          onClick={handleAdd}
          disabled={!comment.trim() || addComment.isPending}
        >
          {addComment.isPending
            ? <span className="loading loading-spinner loading-xs" />
            : <Send size={14} />
          }
        </button>
      </div>

      {/* Comments list */}
      <div className="px-4">
        {commentsLoading ? (
          <div className="py-6 flex justify-center">
            <span className="loading loading-spinner loading-md text-primary" />
          </div>
        ) : comments.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-base-content/40">
              No comments yet. Be the first!
            </p>
          </div>
        ) : (
          comments.map((c) => (
            <CommentCard key={c._id} comment={c} postId={id} />
          ))
        )}
      </div>

    </div>
  );
}

export default PostDetail;