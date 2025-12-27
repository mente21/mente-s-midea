import React, { useEffect, useState } from 'react'
import { BadgeCheck, Heart, MessageCircle, Share2, SendHorizontal } from 'lucide-react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import Comment from './Comment'

const PostCard = ({ post }) => {
    const [likes, setLikes] = useState(post.likes_count || [])
    const [comments, setComments] = useState([])
    const [showComments, setShowComments] = useState(false)
    const [commentText, setCommentText] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [expanded, setExpanded] = useState(false)
    
    const { getToken } = useAuth()
    const currentUser = useSelector((state) => state.user.value)
    const navigate = useNavigate()

    const fetchComments = async () => {
        try {
            const { data } = await api.get(`/api/comment/${post._id}`, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if (data.success) {
                setComments(data.comments)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleAddComment = async (e) => {
        e.preventDefault()
        if (!commentText.trim() || isSubmitting) return

        try {
            setIsSubmitting(true)
            const token = await getToken()
            const { data } = await api.post(
                '/api/comment/add',
                { postId: post._id, text: commentText },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (data.success) {
                setComments((prev) => [data.comment, ...prev])
                setCommentText('')
                // toast.success("Signal transmitted")
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        if (showComments && comments.length === 0) {
            fetchComments()
        }
    }, [showComments])

    const postWithHashtags = post.content?.replace(/(#\w+)/g, '<span class="text-teal-600 font-semibold cursor-pointer hover:underline">$1</span>')

    const handleLike = async () => {
        try {
            const { data } = await api.post(
                `/api/post/like`,
                { postId: post._id },
                { headers: { Authorization: `Bearer ${await getToken()}` } }
            )

            if (data.success) {
                setLikes((prev) => {
                    if (prev.includes(currentUser._id)) {
                        return prev.filter((id) => id !== currentUser._id)
                    } else {
                        return [...prev, currentUser._id]
                    }
                })
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-[32px] p-6 space-y-5 w-full max-w-2xl transition-all hover:border-slate-700/80 hover:bg-slate-900/60 shadow-xl shadow-black/20 group/card'>
            {/* user info */}
            <div className='flex items-center justify-between'>
                <div
                    onClick={() => navigate('/profile/' + post.user._id)}
                    className='inline-flex items-center gap-3.5 cursor-pointer group'
                >
                    <div className='relative'>
                        <img
                            src={post.user?.profile_picture}
                            alt=''
                            className='w-12 h-12 rounded-full shadow-lg ring-2 ring-slate-800 object-cover group-hover:ring-teal-500/50 transition-all duration-300'
                        />
                        <div className='absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]'></div>
                    </div>
                    <div className='min-w-0'>
                        <div className='flex items-center gap-1.5'>
                            <span className='font-bold text-slate-100 group-hover:text-teal-400 transition-colors uppercase tracking-tight text-[13px] truncate max-w-[120px]'>{post.user?.full_name || 'Anonymous'}</span>
                            <BadgeCheck className='w-4 h-4 text-teal-400 fill-teal-400/10' />
                        </div>
                        <div className='text-slate-500 text-[9px] font-black uppercase tracking-widest'>
                            @{post.user?.username || 'user'} · {moment(post.createdAt).fromNow()}
                        </div>
                    </div>
                </div>
                <button className='p-2.5 hover:bg-slate-800 rounded-xl transition-all text-slate-500 hover:text-white group'>
                    <Share2 className='w-4 h-4 group-active:scale-90' />
                </button>
            </div>

            {/* content */}
            {post.content && (
                <div className='space-y-3'>
                    <div
                        className={`text-slate-300 text-[14px] leading-relaxed tracking-wide whitespace-pre-line font-medium px-1 transition-all duration-500 ${!expanded ? 'line-clamp-5' : ''}`}
                        dangerouslySetInnerHTML={{ __html: postWithHashtags }}
                    />
                    {(post.content.length > 280 || post.content.split('\n').length > 5) && (
                        <button 
                            onClick={() => setExpanded(!expanded)}
                            className='text-teal-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors cursor-pointer px-1 flex items-center gap-1.5 group/expand'
                        >
                            <span className='size-1 bg-teal-500 rounded-full group-hover/expand:scale-150 transition-transform'></span>
                            {expanded ? 'Collapse Signal' : 'Expand Signal'}
                        </button>
                    )}
                </div>
            )}

            {/* images */}
            {post.image_urls && post.image_urls.length > 0 && (
                <div className='overflow-hidden rounded-3xl border border-slate-800/50 mt-2 hover:border-slate-700/50 transition-colors'>
                    <div className='grid grid-cols-2 gap-0.5'>
                        {post.image_urls.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                className={`w-full h-80 object-cover hover:scale-105 transition-transform duration-700 cursor-zoom-in ${post.image_urls.length === 1 ? 'col-span-2 h-auto max-h-[600px]' : ''
                                    }`}
                                alt=''
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* actions */}
            <div className='flex items-center gap-8 pt-4 border-t border-slate-800/50 mt-2 px-1'>
                <div 
                    onClick={handleLike}
                    className='flex items-center gap-2 cursor-pointer group/action'
                >
                    <div className={`p-2.5 rounded-xl transition-all duration-300 ${likes.includes(currentUser._id) ? 'bg-red-500/10' : 'hover:bg-red-500/5'}`}>
                        <Heart
                            className={`w-5 h-5 transition-all duration-300 ${likes.includes(currentUser._id) ? 'text-red-500 fill-red-500 scale-110 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'text-slate-500 group-hover/action:text-red-400'
                                }`}
                        />
                    </div>
                    <span className={`text-[12px] font-black ${likes.includes(currentUser._id) ? 'text-red-500' : 'text-slate-500'}`}>
                        {likes.length}
                    </span>
                </div>
                
                <div 
                    onClick={() => setShowComments(!showComments)}
                    className='flex items-center gap-2 cursor-pointer group/action'
                >
                    <div className={`p-2.5 rounded-xl transition-all duration-300 ${showComments ? 'bg-teal-500/10' : 'hover:bg-teal-500/5'}`}>
                        <MessageCircle className={`w-5 h-5 transition-all duration-300 ${showComments ? 'text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.4)]' : 'text-slate-500 group-hover/action:text-teal-400'}`} />
                    </div>
                    <span className={`text-[12px] font-black ${showComments ? 'text-teal-400' : 'text-slate-500'}`}>{showComments ? comments.length : (post.comments_count || 0)}</span>
                </div>
            </div>

            {/* comment section */}
            {showComments && (
                <div className='pt-6 border-t border-slate-800/50 space-y-6 animate-in slide-in-from-top-4 duration-500'>
                    {/* comment input */}
                    <form onSubmit={handleAddComment} className='flex items-center gap-3 px-1'>
                        <img src={currentUser.profile_picture} alt="" className='size-8 rounded-lg object-cover ring-2 ring-slate-800' />
                        <div className='flex-1 relative group/input'>
                            <input 
                                type="text" 
                                placeholder="CONTRIBUTE TO THIS NEURAL THOUGHT..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                className='w-full bg-slate-950/50 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-700 outline-none focus:border-teal-500/30 focus:ring-4 focus:ring-teal-500/5 transition-all font-medium tracking-tight'
                            />
                            <button 
                                type="submit"
                                disabled={!commentText.trim() || isSubmitting}
                                className='absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-600 hover:text-teal-400 disabled:opacity-0 transition-all cursor-pointer'
                            >
                                <SendHorizontal size={16} />
                            </button>
                        </div>
                    </form>

                    {/* comment list */}
                    <div className='space-y-4 max-h-[400px] overflow-y-scroll no-scrollbar pr-2'>
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <Comment key={comment._id} comment={comment} />
                            ))
                        ) : (
                                <div className='py-8 text-center'>
                                    <p className='text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]'>No secondary signals yet.</p>
                                </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default PostCard
