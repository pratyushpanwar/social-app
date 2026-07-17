import React from 'react'
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Camera } from 'lucide-react';
import { useUpdateProfile, useUpdateCoverImage, useUpdateAvatar } from '../hooks/useEditProfile';

function EditProfile() {

    const navigate = useNavigate()
    const user     = useSelector(state => state.auth.user)
    console.log(user);
    
    const [bio, setBio] = useState(user?.bio ?? '')
    const [location, setLocation] = useState(user?.location ?? '')
    const [fullName, setFullName] = useState(`${user?.firstName} ${user?.lastName}` ?? '')

    const [coverPreview, setCoverPreview] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null)

    const coverRef = useRef(null);
    const avatarRef = useRef(null);

    const updateProfile = useUpdateProfile();
    const updateCover = useUpdateCoverImage();
    const updateAvatar = useUpdateAvatar();

    function handleCoverChange(e){
        const file = e.target.files[0];
        if(!file) return;
        setCoverPreview(URL.createObjectURL(file))
        updateCover.mutate(file)
    }

    function handleAvatarChange(e){
    const file = e.target.files[0]
    if(!file) return;
    setAvatarPreview(URL.createObjectURL(file))
    updateAvatar.mutate(file)
    }

    function handleSave(){
        const firstName = fullName.split(" ")[0]
        const lastName = fullName.split(" ")[1]
        updateProfile.mutate({ bio, location, firstName, lastName })
    }
  return (
    <div>

      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-10 bg-base-100/80 backdrop-blur-sm border-b border-base-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            className="btn btn-ghost btn-sm btn-circle"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-bold text-lg">Edit Profile</h1>
        </div>

        <button
          className="btn btn-primary btn-sm rounded-full"
          onClick={handleSave}
          disabled={updateProfile.isPending}
        >
          {updateProfile.isPending && (
            <span className="loading loading-spinner loading-xs" />
          )}
          Save
        </button>
      </div>

      {/* ── Cover image ── */}
      <div
        className="h-32 bg-base-300 relative cursor-pointer group"
        onClick={() => coverRef.current?.click()}
      >
        {/* show preview → uploaded url → empty */}
        {(coverPreview || user?.coverImage?.url) && (
          <img
            src={coverPreview || user?.coverImage.url}
            alt="cover"
            className="w-full h-full object-cover"
            onError={(err) => console.log(err)}
          />
        )}

        {/* hover overlay */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {updateCover.isPending
            ? <span className="loading loading-spinner loading-md text-white" />
            : <Camera size={24} className="text-white" />
          }
        </div>

        <input
          ref={coverRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCoverChange}
        />
      </div>

      {/* ── Body ── */}
      <div className="px-4 pb-8">


    {/* Avatar — overlaps cover */}
        <div className="relative w-20 h-20 -mt-10 mb-4">
          <div
            className="w-20 h-20 rounded-full border-4 border-base-100 overflow-hidden cursor-pointer group relative"
            onClick={() => avatarRef.current?.click()}
          >
            {(avatarPreview || user?.avatar?.url) ? (
              <img
                src={avatarPreview || user.avatar.url}
                alt={user?.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary flex items-center justify-center">
                <span className="text-primary-content text-2xl font-bold">
                  {user?.username?.[0]?.toUpperCase()}
                </span>
              </div>
            )}

            {/* hover overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {updateAvatar.isPending
                ? <span className="loading loading-spinner loading-sm text-white" />
                : <Camera size={16} className="text-white" />
              }
            </div>
          </div>

          <input
            ref={avatarRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        {/* Username — read only, most APIs don't allow changing it */}
        <div className="form-control mb-4">
          <label className="label py-1">
            <span className="label-text font-medium">Username</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full bg-base-200 cursor-not-allowed"
            value={user?.username ?? ''}
            readOnly
          />
          <label className="label py-1">
            <span className="label-text-alt text-base-content/40">
              Username cannot be changed
            </span>
          </label>
        </div>

        {/* Full Name */}
        <div className="form-control">
          <label className="label py-1">
            <span className="label-text font-medium">Full Name</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Where are you based?"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        {/* Bio */}
        <div className="form-control mb-4">
          <label className="label py-1">
            <span className="label-text font-medium">Bio</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full resize-none"
            placeholder="Write something about yourself..."
            rows={3}
            maxLength={160}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <label className="label py-1">
            <span className="label-text-alt text-base-content/40 ml-auto">
              {bio.length}/160
            </span>
          </label>
        </div>

        {/* Location */}
        <div className="form-control">
          <label className="label py-1">
            <span className="label-text font-medium">Location</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Where are you based?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

      </div>
    </div>
  );
}

export default EditProfile