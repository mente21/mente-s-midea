import React, { useEffect, useState } from 'react'
import { dummyRecentMessagesData } from '../assets/assets'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { useAuth, useUser } from '@clerk/clerk-react'
import api from '../api/axios'
import { toast } from 'react-hot-toast'
import { MessageCircle } from 'lucide-react'

const RecentMessage = () => {
    const [messages, setMessages] = useState([])
    const { user } = useUser()
    const { getToken } = useAuth()

    const fetchRecentMessages = async () => {
        try {
            const token = await getToken()
            const { data } = await api.get('/api/user/recent-messages', {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (data.success) {
                // group messages by sender and get the latest message for each sender
                const groupedMessages = data.messages.reduce((acc, message) => {
                    if (!message.from_user_id?._id) return acc;
                    const senderId = message.from_user_id._id
                    if (!acc[senderId] || new Date(message.createdAt) > new Date(acc[senderId].createdAt)) {
                        acc[senderId] = message
                    }
                    return acc
                }, {})

                // sort messages by date
                const sortedMessages = Object.values(groupedMessages).sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                )

                setMessages(sortedMessages)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message) // ❗ fixed wrong reference (`data.message`)
        }
    }

    useEffect(() => {
        if (user) {
            fetchRecentMessages()
            const interval = setInterval(fetchRecentMessages, 30000)
            return () => clearInterval(interval) // ❗ must clear the correct interval id
        }
    }, [user])

    return (
        <div className="bg-slate-900/40 backdrop-blur-3xl w-full mt-6 rounded-[32px] shadow-2xl border border-slate-800/60 p-6 group/messages transition-all duration-500 hover:border-slate-700">
            <div className='flex items-center justify-between mb-8'>
                <h3 className="font-black text-slate-100 tracking-[0.2em] uppercase text-[10px] flex items-center gap-2">
                    <span className='size-2 bg-teal-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.6)]'></span>
                    Neural Signals
                </h3>
                <span className='px-2.5 py-1 bg-teal-500/10 rounded-lg text-[8px] font-black text-teal-400 border border-teal-500/20 uppercase tracking-widest'>Active</span>
            </div>

            <div className="flex flex-col max-h-[450px] overflow-y-scroll no-scrollbar space-y-2">
                {messages.map((message, index) => (
                    <Link
                        to={`/messages/${message.from_user_id._id}`}
                        key={index}
                        className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-slate-800/50 transition-all duration-300 group/item relative overflow-hidden border border-transparent hover:border-slate-700/50"
                    >
                        <div className='relative shrink-0'>
                            <img
                                src={message.from_user_id.profile_picture}
                                alt=""
                                className="size-11 rounded-full object-cover ring-2 ring-slate-800 group-hover/item:ring-teal-500/50 transition-all duration-500 shadow-xl"
                            />
                            {!message.seen && (
                                <span className='absolute -top-0.5 -right-0.5 size-3 bg-teal-400 border-2 border-slate-900 rounded-full shadow-[0_0_10px_rgba(45,212,191,0.6)] animate-pulse'></span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <p className="font-black text-slate-100 truncate text-xs uppercase tracking-tight group-hover/item:text-teal-400 transition-colors">
                                    {message.from_user_id.full_name}
                                </p>
                                <p className="text-[8px] text-slate-600 font-black uppercase whitespace-nowrap ml-2">
                                    {moment(message.createdAt).fromNow(true)}
                                </p>
                            </div>
                            <div className="flex justify-between items-center gap-2">
                                <p className="text-slate-500 truncate text-[10px] font-medium italic lowercase">
                                    {message.text ? `> ${message.text}` : '> shared a media fragment'}
                                </p>
                                {!message.seen && (
                                    <div className="shrink-0 size-2 bg-teal-500 rounded-full shadow-[0_0_8px_rgba(45,212,191,0.4)]"></div>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
                
                {messages.length === 0 && (
                    <div className='py-16 text-center flex flex-col items-center gap-4 opacity-40'>
                        <div className='size-12 bg-slate-950/50 rounded-2xl flex items-center justify-center border border-slate-800'>
                           <MessageCircle className='w-5 h-5 text-slate-700' />
                        </div>
                        <p className='text-slate-600 font-black uppercase tracking-[0.2em] text-[10px]'>Zero active paths</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RecentMessage
