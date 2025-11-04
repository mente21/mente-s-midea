import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'
import { Pencil } from 'lucide-react'

const ProfileModal = ({ setShowEdit }) => {
    const user = dummyUserData
    const [editForm, setEditForm] = useState({
        username: user.username,
        bio: user.bio,
        location: user.location,
        profile_picture: null,
        cover_photo: null,
        full_name: user.full_name,
    })

    const handleSaveProfile = async (e) => {
        e.preventDefault()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 overflow-y-auto">
            <div className="w-full max-w-sm mx-auto bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg p-4 sm:p-5 my-8 scale-95">
                <h1 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 text-center">
                    Edit Profile
                </h1>

                <form className="space-y-3" onSubmit={handleSaveProfile}>
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center gap-1.5 pl-6">
                        <label htmlFor="profile_picture" className="text-sm font-medium text-gray-700">
                            Profile Picture
                            <input
                                hidden
                                type="file"
                                accept="image/*"
                                id="profile_picture"
                                onChange={(e) =>
                                    setEditForm({ ...editForm, profile_picture: e.target.files[0] })
                                }
                            />
                            <div className="group/profile relative mt-2 w-16 h-16">
                                <img
                                    src={
                                        editForm.profile_picture
                                            ? URL.createObjectURL(editForm.profile_picture)
                                            : user.profile_picture
                                    }
                                    alt=""
                                    className="w-full h-full rounded-full object-cover border-2 border-white shadow-md transition-transform duration-300 group-hover/profile:scale-105"
                                />
                                <div className="absolute inset-0 hidden group-hover/profile:flex bg-black/40 rounded-full items-center justify-center transition">
                                    <Pencil className="w-3.5 h-3.5 text-white" />
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-500 text-center mt-1">
                                Click to change profile
                            </p>
                        </label>
                    </div>

                    {/* Cover Photo */}
                    <div>
                        <label htmlFor="cover_photo" className="block text-sm font-medium text-gray-700">
                            Cover Photo
                            <input
                                type="file"
                                accept="image/*"
                                id="cover_photo"
                                hidden
                                onChange={(e) =>
                                    setEditForm({ ...editForm, cover_photo: e.target.files[0] })
                                }
                            />
                            <div className="group/cover relative mt-2 overflow-hidden rounded-md shadow-md">
                                <img
                                    src={
                                        editForm.cover_photo
                                            ? URL.createObjectURL(editForm.cover_photo)
                                            : user.cover_photo
                                    }
                                    alt=""
                                    className="w-full h-28 object-cover rounded-md transition-transform duration-300 group-hover/cover:scale-105"
                                />
                                <div className="absolute inset-0 hidden group-hover/cover:flex bg-black/30 rounded-md items-center justify-center transition">
                                    <Pencil className="w-3.5 h-3.5 text-white" />
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1 text-center">
                                Hover to change cover
                            </p>
                        </label>
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-0.5">
                            Full Name
                        </label>
                        <input
                            type="text"
                            className="w-full p-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs transition"
                            placeholder="Enter your full name"
                            onChange={(e) =>
                                setEditForm({ ...editForm, full_name: e.target.value })
                            }
                            value={editForm.full_name}
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-0.5">
                            Username
                        </label>
                        <input
                            type="text"
                            className="w-full p-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs transition"
                            placeholder="Enter your username"
                            onChange={(e) =>
                                setEditForm({ ...editForm, username: e.target.value })
                            }
                            value={editForm.username}
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-0.5">
                            Bio
                        </label>
                        <textarea
                            rows={2}
                            className="w-full p-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs resize-none transition"
                            placeholder="Write something about yourself"
                            onChange={(e) =>
                                setEditForm({ ...editForm, bio: e.target.value })
                            }
                            value={editForm.bio}
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-0.5">
                            Location
                        </label>
                        <input
                            type="text"
                            className="w-full p-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs transition"
                            placeholder="Enter your location"
                            onChange={(e) =>
                                setEditForm({ ...editForm, location: e.target.value })
                            }
                            value={editForm.location}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="pt-4 flex justify-end space-x-2">
                        <button
                            onClick={() => setShowEdit(false)}
                            type="button"
                            className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition text-xs"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md hover:from-indigo-600 hover:to-purple-700 transition text-xs"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProfileModal
