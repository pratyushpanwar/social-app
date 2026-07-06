function PostSkeleton() {
  return (
    <div className="border-b border-base-200 p-4">
      <div className="flex items-start gap-3">
        <div className="skeleton w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex-1 flex flex-col gap-2.5">
          <div className="skeleton h-3 w-28" />
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-4/5" />
          <div className="skeleton h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export default PostSkeleton;