import React, { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import moment from 'moment'
import StoryModal from './StoryModal'
import StoryViewer from './StoryViewer'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const StoriesBar = () => {
    const [stories, setStories] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [viewStory, setViewStory] = useState(null)
    const { getToken } = useAuth()

    const fetchStories = async () => {
        try {
            const token = await getToken()
            const { data } = await api.get('/api/story/get', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                setStories(data.stories)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchStories()
    }, [])

    return (
        <div className='w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scrollbar overflow-x-auto px-4'>
            <div className='flex gap-5 pb-8'>
                {/* ➕ Add Story Card */}
                <div
                    onClick={() => setShowModal(true)}
                    className='rounded-[28px] shadow-2xl min-w-32 aspect-[3/4.5] cursor-pointer hover:shadow-teal-500/10 transition-all duration-500 border border-slate-800 bg-slate-900/40 backdrop-blur-md flex flex-col items-center justify-center p-4 group overflow-hidden relative'
                >
                    <div className='absolute inset-0 bg-gradient-to-b from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'></div>
                    <div className='size-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-teal-500/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500'>
                        <Plus className='w-7 h-7 text-slate-950 stroke-[3]' />
                    </div>
                    <p className='text-[10px] font-black text-teal-400 uppercase tracking-[0.2em]'>
                        Add Story
                    </p>
                </div>

                {/* 🟣 Stories */}
                {stories.map((story, index) => (
                    <div
                        onClick={() => setViewStory(story)}
                        key={index}
                        className='relative rounded-[28px] shadow-2xl min-w-32 aspect-[3/4.5] cursor-pointer hover:shadow-cyan-500/20 transition-all duration-500 bg-slate-800 ring-1 ring-slate-700/50 overflow-hidden active:scale-95 group'
                    >
                        {/* Media (image/video/text) */}
                        <div className='absolute inset-0 z-0 bg-slate-900 group-hover:scale-110 transition-transform duration-700'>
                            {story.media_type === 'image' ? (
                                <img
                                    src={decodeURI(story.media_url)}
                                    alt=''
                                    className='h-full w-full object-cover opacity-60 group-hover:opacity-80 transition-opacity'
                                />
                            ) : story.media_type === 'video' ? (
                                <video
                                    src={story.media_url}
                                    className='h-full w-full object-cover opacity-60 group-hover:opacity-80 transition-opacity'
                                />
                            ) : (
                                <div className='h-full w-full flex items-center justify-center p-4 bg-gradient-to-br from-purple-900/40 to-slate-900'>
                                    <p className='text-xs text-white/80 font-medium text-center line-clamp-4'>{story.content}</p>
                                </div>
                            )}
                        </div>

                        {/* Overlay Gradient */}
                        <div className='absolute inset-0 z-5 bg-gradient-to-b from-black/40 via-transparent to-black/60'></div>

                        {/* User profile */}
                        <div className='absolute top-3 left-3 z-10 p-0.5 rounded-full ring-2 ring-teal-500 shadow-lg shadow-teal-500/30 group-hover:ring-teal-400 transition-all'>
                            <img
                                src={story.user?.profile_picture}
                                alt=''
                                className='size-8 rounded-full object-cover transition-opacity'
                                onError={(e) => e.target.style.opacity = '0'}
                            />
                        </div>

                        {/* Story content text (if image/video) */}
                        {story.media_type !== 'text' && story.content && (
                            <p className='absolute top-14 left-3 z-10 text-white text-[10px] font-medium truncate max-w-[80px] drop-shadow-md'>
                                {story.content}
                            </p>
                        )}

                        {/* Time */}
                        <div className='absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between'>
                             <p className='text-white/40 text-[9px] font-black uppercase tracking-tighter'>
                                {moment(story.createdAt).fromNow(true)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modals */}
            {showModal && (
                <StoryModal setShowModal={setShowModal} fetchStories={fetchStories} />
            )}
            {viewStory && (
                <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />
            )}
        </div>
    )
}

export default StoriesBar
