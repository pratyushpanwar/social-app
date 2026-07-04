import React from 'react'

function PostSkeleton() {
  return (
    <div className="card bg-base-100 border border-base-200 p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="skeleton w-10 h-10 rounded-full"></div>
        <div className="flex flex-col gap-2 flex-1">
          <div className="skeleton h-3 w-24"></div>
          <div className="skeleton h-3 w-16"></div>
        </div>
      </div>
      <div className="skeleton h-3 w-full mb-2"></div>
      <div className="skeleton h-3 w-3/4"></div>
    </div>
  );
}

export default PostSkeleton