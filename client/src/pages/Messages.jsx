import React from 'react'
import { Eye, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Messages = () => {
    const { connections } = useSelector((state) => state.connections)
    const navigate = useNavigate()

    // ✅ Remove duplicate users (by _id)
    const uniqueConnections = Array.from(
        new Map(connections.map((user) => [user._id, user])).values()
    )

    return (
        <div className="min-h-screen relative bg-transparent h-full overflow-y-scroll no-scrollbar">
            <div className="max-w-4xl mx-auto p-8 relative">
                {/* Background Glows */}
                <div className="absolute top-0 right-0 size-64 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-20 left-0 size-64 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>

                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-slate-100 mb-2 uppercase tracking-tighter">
                        Neural <span className="text-teal-400">Signals</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                        <span className="size-1.5 bg-teal-500 rounded-full animate-pulse"></span>
                        Direct node-to-node communication protocol active.
                    </p>
                </div>

                {/* ✅ Connected Users List */}
                <div className="flex flex-col gap-6">
                    {uniqueConnections.length > 0 ? (
                        uniqueConnections.map((user) => (
                            <div
                                key={user._id}
                                className="w-full flex items-center gap-6 p-6 bg-slate-900/40 backdrop-blur-3xl border border-slate-800/60 rounded-[40px] hover:border-slate-700 transition-all duration-500 group relative overflow-hidden shadow-2xl shadow-black/40"
                            >
                                {/* Profile Picture */}
                                <div className="relative size-16 shrink-0 group-hover:scale-105 transition-transform duration-500">
                                    <img
                                        src={user.profile_picture}
                                        alt={user.full_name}
                                        className="rounded-full size-full object-cover ring-2 ring-slate-800 group-hover:ring-teal-500/50 transition-all"
                                    />
                                    <div className="absolute bottom-0 right-0 size-4 bg-emerald-500 border-2 border-slate-950 rounded-full"></div>
                                </div>

                                {/* User Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-black text-slate-100 uppercase tracking-tight truncate">
                                            {user.full_name}
                                        </p>
                                        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">@{user.username}</span>
                                    </div>
                                    <p className="text-slate-400 text-sm font-medium line-clamp-1 italic">
                                        "{user.bio || 'NEURAL_PATHWAY_INITIALIZED'}"
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => navigate(`/messages/${user._id}`)}
                                        className="size-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-slate-950 shadow-lg shadow-teal-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                    >
                                        <MessageSquare className="w-5 h-5" />
                                    </button>

                                    <button
                                        onClick={() => navigate(`/profile/${user._id}`)}
                                        className="size-12 flex items-center justify-center rounded-2xl bg-slate-800 text-slate-400 border border-slate-700/50 hover:bg-slate-700 hover:text-slate-100 transition-all cursor-pointer"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-center">
                            <div className="size-20 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center mb-6 opacity-50">
                                <MessageSquare className="w-8 h-8 text-slate-600" />
                            </div>
                            <h3 className="text-slate-500 font-black uppercase tracking-widest text-xs">No active signals</h3>
                            <p className="text-slate-700 text-[10px] mt-2 font-black uppercase tracking-[0.2em]">Synchronize with nodes via Discover to start chatting.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Messages
