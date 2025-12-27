import React from 'react'
import { MapPin, MessageCircle, Plus, UserPlus } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useAuth } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { fetchUser } from '../features/user/userSlice'
import toast from 'react-hot-toast'

const UserCard = ({ user }) => {
    const currentUser = useSelector((state) => state.user.value)
    const { getToken } = useAuth()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    if (!user) return null; // Safety check

    // Safe access helpers
    const isFollowing = currentUser?.following?.includes(user._id);
    const isConnected = currentUser?.connections?.includes(user._id);

    const handleFollow = async () => {
        try {
            const { data } = await api.post('/api/user/follow', { id: user._id }, {
                headers: { Authorization: `Bearer ${await getToken()}` },
            })
            if (data.success) {
                toast.success(data.message)
                dispatch(fetchUser(await getToken()))
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleConnectionRequest = async () => {
        if (currentUser.connections.includes(user._id)) {
            return navigate('/messages/' + user._id)
        }
        try {
            const { data } = await api.post('/api/user/connect', { id: user._id }, {
                headers: { Authorization: `Bearer ${await getToken()}` },
            })
            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div
            key={user._id}
            className='p-6 flex flex-col justify-between w-72 bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-[32px] hover:border-slate-700 transition-all duration-300 shadow-xl shadow-black/20 group'
        >
            <div className='text-center'>
                <div className='relative size-20 mx-auto group-hover:scale-105 transition-transform duration-500'>
                    <img
                        src={user.profile_picture}
                        alt=''
                        className='rounded-full size-full shadow-2xl ring-2 ring-slate-800 object-cover group-hover:ring-teal-500/50 transition-all'
                    />
                    <div className='absolute bottom-1 right-1 size-4 bg-emerald-500 border-2 border-slate-900 rounded-full'></div>
                </div>
                <p className='mt-5 font-bold text-slate-100 uppercase tracking-tight'>{user.full_name}</p>
                {user.username && (
                    <p className='text-slate-500 text-[10px] font-black uppercase tracking-widest mt-0.5'>@{user.username}</p>
                )}
                {user.bio && (
                    <p className='text-slate-400 mt-4 text-center text-[12px] px-2 leading-relaxed font-medium line-clamp-3'>
                        {user.bio}
                    </p>
                )}
            </div>

            <div className='flex items-center justify-center gap-3 mt-6 text-[10px] font-black uppercase tracking-tighter'>
                <div className='flex items-center gap-1.5 bg-slate-800/50 text-slate-400 rounded-full px-3 py-1.5 border border-slate-700/50'>
                    <MapPin className='w-3.5 h-3.5' />
                    {user.location || 'GLOBAL'}
                </div>
                <div className='flex items-center gap-1.5 bg-slate-800/50 text-slate-400 rounded-full px-3 py-1.5 border border-slate-700/50'>
                    <span className='text-teal-400'>{user.followers.length}</span> FOLLOWS
                </div>
            </div>

            <div className='flex mt-6 gap-3'>
                {/* follow button */}
                <button
                    onClick={handleFollow}
                    disabled={isFollowing}
                    className={`w-full py-3 rounded-2xl flex justify-center items-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all duration-300 active:scale-95 shadow-lg
                        ${isFollowing 
                            ? 'bg-slate-800 text-slate-500 border border-slate-700 shadow-none cursor-default' 
                            : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 shadow-teal-500/20 cursor-pointer'
                        }
                    `}
                >
                    <UserPlus className='w-4 h-4' />
                    {isFollowing ? 'CONNECTED' : 'FOLLOW'}
                </button>

                {/* connection request button */}
                <button
                    onClick={handleConnectionRequest}
                    className='flex items-center justify-center size-12 bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-teal-400 hover:border-teal-500/50 rounded-2xl cursor-pointer active:scale-95 transition-all'
                >
                    {isConnected ?
                        <MessageCircle className='w-5 h-5' />
                        :
                        <Plus className='w-5 h-5' />
                    }
                </button>
            </div>
        </div>
    )
}

export default UserCard
