import React from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const Notification = ({ t, message }) => {
    const navigate = useNavigate()

    return (
        <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 shadow-2xl rounded-[28px] flex items-center p-4 group transition-all duration-300 hover:scale-[1.02] hover:bg-slate-900 shadow-teal-500/5">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4">
                    <div className='relative'>
                        <img
                            src={message.from_user_id.profile_picture}
                            alt=""
                            className="h-12 w-12 rounded-full ring-2 ring-slate-800 group-hover:ring-teal-500/50 transition-all object-cover"
                        />
                        <div className='absolute -bottom-0.5 -right-0.5 size-3 bg-teal-500 border-2 border-slate-900 rounded-full shadow-[0_0_8px_rgba(45,212,191,0.4)]'></div>
                    </div>
                    <div className='min-w-0'>
                        <p className="text-sm font-black text-slate-100 uppercase tracking-tight truncate">
                            {message.from_user_id.full_name}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium lowercase truncate opacity-80 italic">
                            {message.text ? `> ${message.text.slice(0, 40)}${message.text.length > 40 ? '...' : ''}` : '> shared a media fragment'}
                        </p>
                    </div>
                </div>
            </div>
            <div className='pl-4 border-l border-slate-800/50'>
                <button
                    onClick={() => {
                        navigate(`/messages/${message.from_user_id._id}`)
                        toast.dismiss(t.id)
                    }}
                    className="px-4 py-2 text-teal-400 font-black uppercase tracking-[0.2em] text-[10px] hover:text-white transition-colors cursor-pointer"
                >
                    Reply
                </button>
            </div>
        </div>
    )
}

export default Notification
