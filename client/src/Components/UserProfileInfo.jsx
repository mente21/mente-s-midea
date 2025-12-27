import { Calendar, MapPin, PenBox, Verified } from 'lucide-react'
import React from 'react'
import moment from 'moment'

const UserProfileInfo = ({ user, posts, profileId, setShowEdit }) => {
    return (
        <div className='relative py-6 px-10 md:px-12 bg-transparent'>
            <div className='flex flex-col md:flex-row items-center md:items-start gap-10'>
                <div className='size-36 relative -mt-24 md:-mt-28 group'>
                    <div className='absolute inset-0 bg-teal-500/20 rounded-full blur-[20px] opacity-0 group-hover:opacity-100 transition-opacity'></div>
                    <img 
                        src={user.profile_picture} 
                        alt='' 
                        className='size-full rounded-full object-cover ring-[6px] ring-slate-950 shadow-2xl relative z-20 group-hover:scale-105 transition-transform duration-500' 
                    />
                    <div className='absolute bottom-3 right-3 size-6 bg-teal-500 border-[3px] border-slate-950 rounded-full z-30 shadow-[0_0_15px_rgba(45,212,191,0.5)]'></div>
                </div>
                
                <div className='w-full pt-4 md:pt-0'>
                    <div className='flex flex-col md:flex-row items-center md:items-start justify-between gap-6'>
                        <div className='text-center md:text-left'>
                            <div className='flex items-center justify-center md:justify-start gap-4 mb-1'>
                                <h1 className='text-3xl font-black text-slate-100 uppercase tracking-tighter'>{user.full_name}</h1>
                                <Verified className='size-6 text-teal-400 fill-teal-400/10' />
                            </div>
                            <p className='text-slate-500 font-black text-xs uppercase tracking-[0.2em]'>
                                {user.username ? `@${user.username}` : `ADD_IDENTITY`}
                            </p>
                        </div>

                        {/* Edit button */}
                        {!profileId && (
                            <button
                                onClick={() => setShowEdit(true)}
                                className='flex items-center gap-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-teal-500/20 cursor-pointer'
                            >
                                <PenBox className='size-4' />
                                RECONFIGURE
                            </button>
                        )}
                    </div>

                    <p className='text-slate-400 text-[13px] max-w-2xl mt-6 leading-relaxed font-medium text-center md:text-left italic'>
                        "{user.bio || 'Neural pathway initialization complete. Ready for cognitive networking.'}"
                    </p>

                    <div className='flex flex-wrap items-center justify-center md:justify-start gap-x-8 gap-y-3 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 mt-6'>
                        <span className='flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl'>
                            <MapPin className='size-3.5 text-teal-400' />
                            {user.location ? user.location : 'PLANETARY'}
                        </span>
                        <span className='flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl'>
                            <Calendar className='size-3.5 text-teal-400' />
                            OPERATIONAL SINCE{' '}
                            <span className='text-slate-300'>
                                {moment(user.createdAt).format('MM.YYYY')}
                            </span>
                        </span>
                    </div>

                    <div className='flex items-center justify-center md:justify-start gap-12 mt-10 border-t border-slate-800/80 pt-8'>
                        <div className='text-center'>
                            <div className='text-2xl font-black text-slate-100 tracking-tighter'>{posts.length}</div>
                            <div className='text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1'>Emissions</div>
                        </div>
                        <div className='text-center'>
                            <div className='text-2xl font-black text-slate-100 tracking-tighter'>{user.followers.length}</div>
                            <div className='text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1'>Nodes</div>
                        </div>
                        <div className='text-center'>
                            <div className='text-2xl font-black text-slate-100 tracking-tighter'>{user.following.length}</div>
                            <div className='text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1'>Synchronized</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfileInfo
