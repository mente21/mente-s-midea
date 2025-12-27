import React, { useEffect, useRef, useState } from 'react'
import { ImageIcon, SendHorizontal } from 'lucide-react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { addMessage, fetchMessages, resetMessages } from '../features/messages/messagesSlice'
import api from '../api/axios'
import toast from 'react-hot-toast'

const ChatBox = () => {
    const { messages } = useSelector((state) => state.messages)
    const { userId } = useParams()
    const { getToken } = useAuth()
    const dispatch = useDispatch()


    const [text, setText] = useState('')
    const [image, setImage] = useState(null)
    const [user, setUser] = useState(null)
    const messagesEndRef = useRef(null)

    const connections = useSelector((state) => state.connections.connections)

    const fetchUserMessages = async () => {
        try {
            const token = await getToken()
            dispatch(fetchMessages({ token, userId }))
        } catch (error) {
            toast.error(error.message)
        }
    }


    const sendMessage = async () => {
        try {
            if (!text && !image) return
            const token = await getToken()
            const formData = new FormData()
            formData.append('to_user_id', userId)
            formData.append('text', text)
            image && formData.append('image', image);


            const { data } = await api.post('/api/message/send', formData, {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (data.success) {
                setText('')
                setImage(null)
                dispatch(addMessage(data.message))
            } else {
                throw new Error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    useEffect(() => {

        fetchUserMessages()

        return () => {
            dispatch(resetMessages())
        }

    }, [userId])

    useEffect(() => {
        if (connections.length > 0) {
            const user = connections.find(connection => connection._id === userId)
            setUser(user)
        }

    }, [connections, userId])



    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    if (!user) return (
        <div className="flex flex-col justify-center items-center h-screen gap-4">
            <div className="size-12 rounded-full border-4 border-teal-500/20 border-t-teal-500 animate-spin shadow-[0_0_15px_rgba(45,212,191,0.2)]"></div>
            <p className="text-teal-400/50 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Establishing Connection...</p>
        </div>
    )

    return (
        <div className="flex flex-col h-screen bg-transparent">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900/60 backdrop-blur-xl border-b border-slate-800/60 sticky top-0 z-10 shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <img 
                            src={user.profile_picture} 
                            alt="" 
                            className="size-11 rounded-full ring-2 ring-slate-800 object-cover group-hover:ring-teal-500/50 transition-all duration-500" 
                        />
                        <div className="absolute bottom-0 right-0 size-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                    </div>
                    <div>
                        <p className="font-black text-slate-100 uppercase tracking-tighter text-lg">{user.full_name}</p>
                        <p className="text-[10px] text-teal-400 font-black uppercase tracking-widest -mt-0.5">@{user.username}</p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-scroll no-scrollbar p-6">
                <div className="space-y-6 max-w-4xl mx-auto flex flex-col pt-4">
                    {messages
                        .slice()
                        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                        .map((message, index) => {
                            const isMe = message.to_user_id === user._id;
                            return (
                                <div
                                    key={index}
                                    className={`flex flex-col ${!isMe ? 'items-start' : 'items-end'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                                >
                                    <div
                                        className={`px-5 py-3.5 text-[14px] font-medium max-w-sm md:max-w-md shadow-xl transition-all duration-300
                                            ${!isMe
                                                ? 'bg-slate-800 text-slate-100 rounded-[24px] rounded-bl-none border border-slate-700/50'
                                                : 'bg-gradient-to-br from-teal-500 to-cyan-500 text-slate-950 font-bold rounded-[24px] rounded-br-none shadow-teal-500/10'
                                            }`}
                                    >
                                        {message.message_type === 'image' && (
                                            <div className="mb-2 relative rounded-[16px] overflow-hidden border border-black/10 shadow-inner">
                                                <img
                                                    src={message.media_url}
                                                    className="w-full object-cover max-h-[300px]"
                                                    alt=""
                                                />
                                            </div>
                                        )}
                                        <p className="leading-relaxed">{message.text}</p>
                                    </div>
                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1.5 px-2">
                                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            );
                        })}
                    <div ref={messagesEndRef}></div>
                </div>
            </div>

            {/* Input Bar */}
            <div className="px-6 pb-6 pt-2">
                <div className="flex items-center gap-4 pl-6 p-2 bg-slate-900/60 backdrop-blur-xl w-full max-w-2xl mx-auto border border-slate-800/80 shadow-2xl rounded-[32px] group focus-within:border-teal-500/30 transition-all duration-300">
                    <input
                        type="text"
                        className="flex-1 bg-transparent outline-none text-slate-200 text-sm font-medium placeholder:text-slate-600 tracking-tight"
                        placeholder="TRANSMIT MESSAGE..."
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        onChange={(e) => setText(e.target.value)}
                        value={text}
                    />
                    
                    <div className="flex items-center gap-3 pr-2">
                        <label htmlFor="image" className="cursor-pointer group/label">
                            {image ? (
                                <div className="relative size-10 ring-2 ring-teal-500 rounded-xl overflow-hidden shadow-lg p-0.5 bg-slate-800">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt=""
                                        className="size-full object-cover rounded-lg"
                                    />
                                    <div className="absolute inset-0 bg-teal-500/20"></div>
                                </div>
                            ) : (
                                <div className="size-10 flex items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-teal-400 hover:bg-slate-700 transition-all border border-slate-700/50">
                                    <ImageIcon className="size-5" />
                                </div>
                            )}
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                hidden
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </label>

                        <button
                            onClick={sendMessage}
                            disabled={!text && !image}
                            className="bg-gradient-to-br from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 p-3 rounded-full shadow-lg shadow-teal-500/20 active:scale-90 transition-all cursor-pointer disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed group/btn"
                        >
                            <SendHorizontal size={20} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatBox
