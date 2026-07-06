import { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { usePosts, useCreatePost } from '../hooks/usePosts';
import PostCard from '../components/PostCard';
import PostSkeleton from '../components/PostSkeleton';

function Feed() {
  const user = useSelector((state) => state.auth.user);
  const [content, setContent] = useState('');
  const loadMoreRef = useRef(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePosts();


  
  const createPost = useCreatePost();

  // IntersectionObserver — auto-loads next page when bottom div enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage)
          fetchNextPage();
      },
      { threshold: 0.1 }
    );
    const el = loadMoreRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handlePost = () => {
    if (!content.trim()) return;
    createPost.mutate({ content }, { onSuccess: () => setContent('') });
  };

  if (isLoading)
    return <div>{[...Array(10)].map((_, i) => <PostSkeleton key={i} />)}</div>;

  if (isError)
    return (
      <div className="p-8 text-center">
        <p className="text-base-content/50 mb-3">Could not load posts.</p>
        <button className="btn btn-sm btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );

  return (
    <div>
      {/* Create post */}
      <div className="border-b border-base-200 p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-primary-content font-bold text-sm">
              {user?.username?.[0]?.toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <textarea
              className="textarea w-full text-sm resize-none bg-transparent border-none focus:outline-none placeholder:text-base-content/40 min-h-12"
              placeholder="What's on your mind?"
              rows={2}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                // Ctrl+Enter or Cmd+Enter submits
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handlePost();
              }}
            />
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-base-content/30">{content.length}/280</span>
              <button
                className="btn btn-primary btn-sm"
                onClick={handlePost}
                disabled={!content.trim() || createPost.isPending}
              >
                {createPost.isPending && (
                  <span className="loading loading-spinner loading-xs" />
                )}
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      {data.pages.map((page, i) => (
        <div key={i}>
          {page.posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ))}

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="py-6 flex justify-center">
        {isFetchingNextPage && (
          <span className="loading loading-spinner loading-md text-primary" />
        )}
        {!hasNextPage && data.pages[0]?.posts?.length > 0 && (
          <p className="text-sm text-base-content/30">You're all caught up</p>
        )}
      </div>
    </div>
  );
}

export default Feed;