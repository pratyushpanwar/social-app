import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, UserCheck, UserPlus } from 'lucide-react';
import { useMyProfile, useProfile, useUserPosts } from '../hooks/useProfile';
import { useFollow } from '../hooks/useFollow';
import PostCard from '../components/PostCard';
import PostSkeleton from '../components/PostSkeleton';
import { useState } from 'react';

function Profile() {
  useMyProfile()
  const { username } = useParams();
  console.log(username);
  
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  
  const { data: profile, isLoading, isError, error } = useProfile(username);
  const { data: posts = [], isLoading: postsLoading } = useUserPosts(username);
  const follow = useFollow(profile?.account._id, username);
  
  const isOwnProfile = currentUser?.account?.username === username;

  const [avatarUrlError, setAvatarUrlError] = useState(false)
  const [coverImgError, setCoverImageError] = useState(false)

  const fullName = `${profile?.firstName} ${profile?.lastName}`

  // console.log(profile)
  
  // ── Loading ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div>
        {/* cover skeleton */}
        <div className="skeleton h-32 w-full rounded-none" />
        <div className="px-4 pb-4">
          <div className="skeleton w-20 h-20 rounded-full -mt-10 mb-3" />
          <div className="skeleton h-4 w-32 mb-2" />
          <div className="skeleton h-3 w-48" />
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────
  if (isError || !profile) {
    return (
      <div className="p-8 text-center">
        <p className="text-base-content/50 mb-3">User not found.</p>
        <button className="btn btn-sm btn-ghost" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    );
  }

  return (
    <div>

      {/* ── Sticky header ── */}
      <div className="sticky top-0 bg-base-100/80 backdrop-blur-sm border-b border-base-200 px-4 py-3 flex items-center gap-3 z-10">
        <button
          className="btn btn-ghost btn-sm btn-circle"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="font-bold leading-tight">{profile.account.username}</p>
          <p className="text-xs text-base-content/50">
            {posts.length} posts
          </p>
        </div>
      </div>

      {/* ── Cover image ── */}
      <div className="h-32 bg-base-300 relative">
        { !coverImgError && profile.coverImage?.url && (
          <img
            src={profile.coverImage.url}
            alt="cover"
            className="w-full h-full object-cover"
            onError={() => setCoverImageError(true)}
          />
        )}

        {/* Avatar — overlaps cover */}
        <div className="absolute -bottom-10 left-4">
          { !avatarUrlError && profile?.account?.avatar?.url ? (
            <img
              src={profile.account.avatar.url}
              alt={profile.username}
              onError={() => setAvatarUrlError(true)}
              className="w-20 h-20 rounded-full object-cover border-4 border-base-100"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary border-4 border-base-100 flex items-center justify-center">
              <span className="text-primary-content text-2xl font-bold">
                {profile.account.username?.[0]?.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Profile info ── */}
      <div className="px-4 pt-12 pb-4">

        {/* Follow / Edit button */}
        <div className="flex justify-end mb-3">
          {isOwnProfile ? (
            <button 
            className="btn btn-sm btn-outline rounded-full"
            onClick={() => navigate('/edit-profile')}
            >
              Edit profile
            </button>
          ) : (
            <button
              className={`btn btn-sm rounded-full gap-2
                ${profile.isFollowing
                  ? 'btn-outline'
                  : 'btn-primary'
                }`}
              onClick={() => follow.mutate({})}
              disabled={follow.isPending}
            >
              {follow.isPending ? (
                <span className="loading loading-spinner loading-xs" />
              ) : profile.isFollowing ? (
                <><UserCheck size={14} /> Following</>
              ) : (
                <><UserPlus size={14} /> Follow</>
              )}
            </button>
          )}
        </div>

        {/* Name + username */}
        <h2 className="font-bold text-xl leading-tight">{fullName}</h2>
        <p className="text-base-content/50 text-sm mb-2">@{profile.account.username}</p>

        {/* Bio */}
        {profile.bio && (
          <p className="text-sm text-base-content/80 mb-3 leading-relaxed">
            {profile.bio}
          </p>
        )}

        {/* Follower counts */}
        <div className="flex gap-4 text-sm">
          <span>
            <strong>{profile.followingCount ?? 0}</strong>{' '}
            <span className="text-base-content/50">Following</span>
          </span>
          <span>
            <strong>{profile.followersCount ?? 0}</strong>{' '}
            <span className="text-base-content/50">Followers</span>
          </span>
        </div>
      </div>

      {/* ── Posts tab divider ── */}
      <div className="border-b border-base-200">
        <div className="px-4">
          <button className="py-3 text-sm font-semibold border-b-2 border-primary text-primary">
            Posts
          </button>
        </div>
      </div>

      {/* ── Posts list ── */}
      {postsLoading ? (
        <div>
          {[...Array(3)].map((_, i) => <PostSkeleton key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm text-base-content/40">No posts yet.</p>
        </div>
      ) : (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      )}

    </div>
  );
}

export default Profile;