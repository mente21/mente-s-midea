import React, { useEffect, useState } from 'react'
import { Users, UserPlus, UserCheck, UserRoundPen, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useAuth } from '@clerk/clerk-react'
import { fetchConnection } from '../features/connections/connectionsSlice'
import api from '../api/axios'
import toast from 'react-hot-toast'

const ConnectionsPage = () => {
    const [currentTab, setCurrentTab] = useState('Followers')
    const navigate = useNavigate()
    const { getToken } = useAuth()
    const dispatch = useDispatch()

    const { connections, pendingConnections, followers, following } = useSelector(
        (state) => state.connections
    )

    const dataArray = [
        { label: 'Followers', value: followers, icon: Users },
        { label: 'Following', value: following, icon: UserCheck },
        { label: 'Pending', value: pendingConnections, icon: UserRoundPen },
        { label: 'Connections', value: connections, icon: UserPlus },
    ]

    const handleUnfollow = async (userId) => {
        try {
            const { data } = await api.post(
                '/api/user/unfollow',
                { id: userId },
                {
                    headers: { Authorization: `Bearer ${await getToken()}` },
                }
            )
            if (data.success) {
                toast.success(data.message)
                dispatch(fetchConnection(await getToken()))
            } else {
                toast(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const acceptConnection = async (userId) => {
        try {
            const { data } = await api.post(
                '/api/user/accept',
                { id: userId },
                {
                    headers: { Authorization: `Bearer ${await getToken()}` },
                }
            )
            if (data.success) {
                toast.success(data.message)
                dispatch(fetchConnection(await getToken()))
            } else {
                toast(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getToken().then((token) => {
            dispatch(fetchConnection(token))
        })
    }, [])

    return (
        <div className='min-h-screen bg-transparent h-full overflow-y-scroll no-scrollbar'>
            <div className='max-w-6xl mx-auto p-8'>
                {/* Header */}
                <div className='mb-10'>
                    <h1 className='text-4xl font-black text-slate-100 mb-2 uppercase tracking-tighter'>
                        Neural <span className='text-teal-400'>Connections</span>
                    </h1>
                    <p className='text-slate-500 font-bold text-xs uppercase tracking-widest'>
                        Manage your cognitive network and synchronized nodes.
                    </p>
                </div>

                {/* Status Dashboard */}
                <div className='mb-10 grid grid-cols-2 md:grid-cols-4 gap-6'>
                    {dataArray.map((item, index) => (
                        <div
                            key={index}
                            className='flex flex-col items-center justify-center p-6 bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 shadow-2xl rounded-[32px] hover:border-teal-500/30 transition-all duration-300 group'
                        >
                            <span className='text-2xl font-black text-slate-100 tracking-tighter group-hover:text-teal-400 transition-colors'>{item.value?.length || 0}</span>
                            <p className='text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mt-1'>{item.label}</p>
                        </div>
                    ))}
                </div>

                {/* Navigation Tabs */}
                <div className='inline-flex bg-slate-900/50 backdrop-blur-3xl border border-slate-800/60 rounded-[28px] p-2 shadow-2xl mb-12'>
                    {dataArray.map((tab) => (
                        <button
                            onClick={() => setCurrentTab(tab.label)}
                            key={tab.label}
                            className={`cursor-pointer flex items-center px-6 py-3 rounded-2xl transition-all duration-300 group ${currentTab === tab.label
                                ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20'
                                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                                }`}
                        >
                            <tab.icon className={`w-4 h-4 ${currentTab === tab.label ? 'text-slate-950' : 'group-hover:text-teal-400'}`} />
                            <span className='ml-3 text-[10px] font-black uppercase tracking-widest'>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Connections Matrix */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {dataArray
                        .find((item) => item.label === currentTab)
                        ?.value?.map((user) => (
                            <div
                                key={user._id}
                                className='flex flex-col p-8 bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 shadow-2xl rounded-[40px] hover:border-slate-700 transition-all duration-500 group relative overflow-hidden'
                            >
                                <div className='absolute top-0 right-0 size-32 bg-teal-500/5 rounded-full blur-3xl pointer-events-none'></div>
                                
                                <div className='flex items-center gap-5 mb-6'>
                                    <div className='relative size-16 shrink-0'>
                                        <img
                                            src={user.profile_picture}
                                            alt=''
                                            className='rounded-full size-full object-cover ring-2 ring-slate-800 group-hover:ring-teal-500/50 transition-all duration-500'
                                        />
                                        <div className='absolute bottom-0 right-0 size-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full'></div>
                                    </div>
                                    <div className='min-w-0'>
                                        <p className='font-black text-slate-100 uppercase tracking-tight truncate'>{user.full_name}</p>
                                        <p className='text-slate-500 text-[10px] font-bold uppercase tracking-widest'>@{user.username}</p>
                                    </div>
                                </div>

                                <p className='text-slate-400 text-xs leading-relaxed font-medium mb-8 line-clamp-2 italic'>
                                    "{user.bio || 'NEURAL_PATHWAY_ACTIVE'}"
                                </p>

                                <div className='flex gap-3 mt-auto'>
                                    <button
                                        onClick={() => navigate(`/profile/${user._id}`)}
                                        className='flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all border border-slate-700/50 cursor-pointer active:scale-95'
                                    >
                                        Inspect
                                    </button>

                                    {currentTab === 'Following' && (
                                        <button
                                            onClick={() => handleUnfollow(user._id)}
                                            className='px-6 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all cursor-pointer active:scale-95'
                                        >
                                            Disconnect
                                        </button>
                                    )}

                                    {currentTab === 'Pending' && (
                                        <button
                                            onClick={() => acceptConnection(user._id)}
                                            className='flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-lg shadow-teal-500/20 transition-all cursor-pointer active:scale-95'
                                        >
                                            Synchronize
                                        </button>
                                    )}

                                    {currentTab === 'Connections' && (
                                        <button
                                            onClick={() => navigate(`/messages/${user._id}`)}
                                            className='flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95'
                                        >
                                            <MessageSquare className='w-4 h-4' />
                                            Signal
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    
                    {(!dataArray.find((item) => item.label === currentTab)?.value || dataArray.find((item) => item.label === currentTab)?.value.length === 0) && (
                        <div className='col-span-full py-32 text-center animate-in fade-in duration-700'>
                            <div className='size-20 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6'>
                                <Users className='w-8 h-8 text-slate-700' />
                            </div>
                            <h3 className='text-slate-500 font-bold uppercase tracking-widest text-xs'>Zero nodes detected in this sector</h3>
                            <p className='text-slate-700 text-[10px] mt-2 font-black uppercase tracking-[0.2em]'>Expand your search to find more minds.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ConnectionsPage
