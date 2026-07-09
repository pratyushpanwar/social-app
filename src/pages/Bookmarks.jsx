import { Bookmark } from 'lucide-react';
import { useBookmarks } from '../hooks/useBookmarks';
import PostCard from '../components/PostCard';
import PostSkeleton from '../components/PostSkeleton';

function Bookmarks() {
  const { data, isLoading, isError } = useBookmarks();

  // console.log(data) to verify the exact field name from freeapi
  const posts = data?.posts ?? data?.bookmarkedPosts ?? [];

  if (isLoading)
    return <div>{[...Array(3)].map((_, i) => <PostSkeleton key={i} />)}</div>;

  if (isError)
    return (
      <div className="p-8 text-center">
        <p className="text-base-content/50">Failed to load bookmarks.</p>
      </div>
    );

  return (
    <div>

      {/* Header */}
      <div className="sticky top-0 bg-base-100/80 backdrop-blur-sm border-b border-base-200 px-4 py-3 z-10">
        <div className="flex items-center gap-2">
          <Bookmark size={20} className="text-primary" />
          <h1 className="font-bold text-lg">Bookmarks</h1>
        </div>
        <p className="text-xs text-base-content/50 mt-0.5">
          {posts.length} saved posts
        </p>
      </div>

      {/* Empty state */}
      {posts.length === 0 ? (
        <div className="p-12 text-center">
          <Bookmark size={40} className="text-base-content/20 mx-auto mb-3" />
          <p className="text-sm text-base-content/50">Nothing saved yet.</p>
          <p className="text-xs text-base-content/30 mt-1">
            Tap the bookmark on any post to save it here.
          </p>
        </div>
      ) : (
        posts.map(post => <PostCard key={post._id} post={post} />)
      )}

    </div>
  );
}

export default Bookmarks;