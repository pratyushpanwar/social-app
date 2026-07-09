import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import { useLikePost } from '../hooks/usePosts';
import { timeAgo } from '../utils/formDate';
import { useToggleBookmark } from '../hooks/useBookmarks';

function PostCard({ post }) {
  
  const navigate = useNavigate();
  const like = useLikePost();
  const bookmark = useToggleBookmark();
  
  const author      = post.author || post.owner || {};
  // const authorName  = author.firstName + " " + author.lastName || 'Unknown';
  const authorName = author.account.username || "Unknown"
  const authorAvatar = author.avatar?.url;
  const authorId    = author._id;

  const goToPost    = ()  => navigate(`/post/${post._id}`);
   const goToProfile = (e) => { e.stopPropagation(); navigate(`/profile/${authorName}`); };

  return (
    <article
      className="border-b border-base-200 p-4 hover:bg-base-50 transition-colors cursor-pointer"
      onClick={goToPost}
    >

      <div className="flex items-start gap-3">


        <button onClick={goToProfile} className="flex-shrink-0">
          {authorAvatar ? (
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-content font-bold text-sm">
                {authorName[0]?.toUpperCase()}
              </span>
            </div>
          )}
        </button>

        <div className="flex-1 min-w-0">

          <div className="flex items-center gap-2 flex-wrap mb-1">
            <button
              onClick={goToProfile}
              className="font-semibold text-sm hover:underline"
            >
              {authorName}
            </button>
            <span className="text-xs text-base-content/50">
              {timeAgo(post.createdAt)}
            </span>
          </div>


          <p className="text-sm text-base-content/80 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>
      </div>


      {post.images?.[0]?.url && (
        <img
          src={post.images[0].url}
          alt="post"
          className="rounded-xl w-full max-h-80 object-cover mt-3"
        />
      )}


      <div
        className="flex items-center gap-5 mt-3 pt-2 border-t border-base-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Like */}
        <button
          className={`flex items-center gap-1.5 text-sm transition-colors
            ${post.isLiked
              ? 'text-red-500'
              : 'text-base-content/40 hover:text-red-400'
            }`}
          onClick={() => like.mutate({postId: post._id, username: authorName})}
          disabled={like.isPending}
        >
          <Heart size={16} fill={post.isLiked ? 'currentColor' : 'none'} />
          <span>{post.likes ?? 0}</span>
        </button>


        <button
          className="flex items-center gap-1.5 text-sm text-base-content/40 hover:text-primary transition-colors"
          onClick={goToPost}
        >
          <MessageCircle size={16} />
          <span>{post.comments ?? 0}</span>
        </button>


        <button 
        className="ml-auto text-base-content/40 hover:text-primary transition-colors"
        onClick={() => bookmark.mutate(post._id)}
        disabled={bookmark.isPending}
        >
          <Bookmark size={16} fill={post.isBookmarked ? 'currentColor' : 'none'}/>
        </button>
      </div>
    </article>
  );
}

export default PostCard;