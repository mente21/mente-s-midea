import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'
import { Pencil } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../features/user/userSlice'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'


const ProfileModal = ({ setShowEdit }) => {
    const dispatch = useDispatch()
    const { getToken } = useAuth()

    const user = useSelector((state) => state.user.value)
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

        try {
            const userData = new FormData();
            const { full_name, username, bio, location, profile_picture, cover_photo } = editForm
            userData.append('username', username);
            userData.append('bio', bio);
            userData.append('location', location);
            userData.append('full_name', full_name);
            profile_picture && userData.append('profile', profile_picture)
            cover_photo && userData.append('cover', cover_photo)



            const token = await getToken()
            dispatch(updateUser({ userData, token }))
            setShowEdit(false)

        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto no-scrollbar">
            <div className="w-full max-w-lg mx-auto bg-slate-900/40 backdrop-blur-3xl border border-slate-800/60 rounded-[40px] shadow-2xl p-8 my-8 animate-in zoom-in-95 duration-300">
                <div className='mb-8'>
                    <h1 className="text-2xl font-black text-slate-100 uppercase tracking-tighter">
                        Node <span className='text-teal-400'>Reconfiguration</span>
                    </h1>
                    <p className='text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1'>Update your neural identity across the network.</p>
                </div>

                <form className="space-y-6" onSubmit={e => toast.promise(
                    handleSaveProfile(e), { 
                        loading: 'Syncing Changes...',
                        success: 'Profile Updated',
                        error: 'Sync Failed'
                    }
                )}>
                    {/* Media Configuration Area */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 pb-2'>
                        {/* Profile Picture */}
                        <div className="flex flex-col items-center gap-3">
                            <label htmlFor="profile_picture" className="text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer group/label">
                                Profile Core
                                <input
                                    hidden
                                    type="file"
                                    accept="image/*"
                                    id="profile_picture"
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, profile_picture: e.target.files[0] })
                                    }
                                />
                                <div className="group/profile relative mt-3 size-24">
                                    <img
                                        src={
                                            editForm.profile_picture
                                                ? URL.createObjectURL(editForm.profile_picture)
                                                : user.profile_picture
                                        }
                                        alt=""
                                        className="size-full rounded-3xl object-cover ring-2 ring-slate-800 group-hover/profile:ring-teal-500/50 transition-all duration-500 shadow-2xl"
                                    />
                                    <div className="absolute inset-0 opacity-0 group-hover/profile:opacity-100 bg-slate-950/60 rounded-3xl flex items-center justify-center transition-all duration-300">
                                        <Pencil className="w-5 h-5 text-teal-400" />
                                    </div>
                                    <div className='absolute -bottom-1 -right-1 size-5 bg-teal-500 border-2 border-slate-900 rounded-lg'></div>
                                </div>
                            </label>
                            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">Modify central avatar</p>
                        </div>

                        {/* Cover Configuration */}
                        <div className='flex flex-col'>
                            <label htmlFor="cover_photo" className="text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer group/label">
                                Environment Skin
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="cover_photo"
                                    hidden
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, cover_photo: e.target.files[0] })
                                    }
                                />
                                <div className="group/cover relative mt-3 h-24 w-full overflow-hidden rounded-2xl border border-slate-800/60 shadow-inner bg-slate-950/30">
                                    <img
                                        src={
                                            editForm.cover_photo
                                                ? URL.createObjectURL(editForm.cover_photo)
                                                : user.cover_photo
                                        }
                                        alt=""
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover/cover:scale-110 opacity-60 group-hover:opacity-80"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20 group-hover/cover:bg-slate-950/40 transition-all duration-300">
                                        <Pencil className="w-4 h-4 text-teal-400 opacity-60 group-hover/cover:opacity-100" />
                                    </div>
                                </div>
                            </label>
                            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter mt-3">Reconstruct background</p>
                        </div>
                    </div>

                    {/* Data Fields */}
                    <div className='space-y-4 pt-2'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1.5 ml-1">
                                    Biological Designation
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-950/50 border border-slate-800/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-700 outline-none focus:border-teal-500/30 focus:ring-4 focus:ring-teal-500/5 transition-all font-medium"
                                    placeholder="Full Name"
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, full_name: e.target.value })
                                    }
                                    value={editForm.full_name}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1.5 ml-1">
                                    Network Handle
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-950/50 border border-slate-800/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-700 outline-none focus:border-teal-500/30 focus:ring-4 focus:ring-teal-500/5 transition-all font-medium"
                                    placeholder="Username"
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, username: e.target.value })
                                    }
                                    value={editForm.username}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1.5 ml-1">
                                Neural Payload (Bio)
                            </label>
                            <textarea
                                rows={3}
                                className="w-full bg-slate-950/50 border border-slate-800/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-700 outline-none resize-none focus:border-teal-500/30 focus:ring-4 focus:ring-teal-500/5 transition-all font-medium leading-relaxed"
                                placeholder="Describe your consciousness..."
                                onChange={(e) =>
                                    setEditForm({ ...editForm, bio: e.target.value })
                                }
                                value={editForm.bio}
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1.5 ml-1">
                                Geographic Coordinates
                            </label>
                            <input
                                type="text"
                                className="w-full bg-slate-950/50 border border-slate-800/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-700 outline-none focus:border-teal-500/30 focus:ring-4 focus:ring-teal-500/5 transition-all font-medium"
                                placeholder="e.g. Neo Tokyo, Sector 7"
                                onChange={(e) =>
                                    setEditForm({ ...editForm, location: e.target.value })
                                }
                                value={editForm.location}
                            />
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-8 flex items-center justify-end gap-4 border-t border-slate-800/80">
                        <button
                            onClick={() => setShowEdit(false)}
                            type="button"
                            className="px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-200 transition-colors border border-transparent hover:bg-slate-800/50"
                        >
                            Abort
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-teal-500/10 hover:scale-105 active:scale-95 transition-all"
                        >
                            Synchronize Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProfileModal
