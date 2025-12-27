import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Loading from '../Components/Loading'
import StoriesBar from '../Components/StoriesBar'
import PostCard from '../Components/PostCard'
import RecentMessage from '../Components/RecentMessage'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { Brain } from 'lucide-react'

const Feed = () => {
    const [feeds, setFeeds] = useState([])
    const [loading, setLoading] = useState(true)
    const { getToken } = useAuth()

    const fetchFeeds = async () => {
        try {
            setLoading(true)
            const { data } = await api.get('/api/post/feed', {
                headers: { Authorization: `Bearer ${await getToken()}` },
            })

            if (data.success) {
                setFeeds(data.posts || [])
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchFeeds()
    }, [])

    return !loading ? (
        <div className='h-full overflow-y-scroll no-scrollbar py-8 xl:pr-5 flex items-start justify-center xl:gap-10 bg-transparent'>
            {/* stories and post list */}
            <div className='flex-1 max-w-2xl'>
                <StoriesBar />
                <div className='p-4 space-y-8'>
                    {feeds.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                    {feeds.length === 0 && (
                        <div className='py-20 text-center space-y-4'>
                            <div className='size-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto border border-slate-800 shadow-2xl'>
                                <Brain className='w-10 h-10 text-slate-700' />
                            </div>
                            <h3 className='text-slate-400 font-bold tracking-tight lowercase tracking-widest text-xs'>No connections detected</h3>
                            <p className='text-slate-600 text-[10px] px-20 uppercase tracking-[0.2em] font-black'>Unleash your mind. Discover others.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* right sidebar */}
            <div className='max-xl:hidden sticky top-8 space-y-6'>
                <div className='max-w-xs bg-slate-900/40 backdrop-blur-2xl p-6 rounded-[32px] shadow-2xl border border-slate-800/50 transition-all hover:bg-slate-900/60 group'>
                    <div className='flex items-center justify-between mb-5'>
                        <h3 className='text-slate-200 font-bold text-[10px] tracking-[0.2em] uppercase'>Sponsor</h3>
                        <span className='text-[9px] font-black text-teal-400 bg-teal-400/10 px-2.5 py-1 rounded-full border border-teal-500/20'>PRO</span>
                    </div>
                    <div className='relative overflow-hidden rounded-2xl mb-5 aspect-video border border-slate-800/50'>
                         <img src={assets.sponsored_img} alt="Mente AI" className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700' />
                         <div className='absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60'></div>
                    </div>
                    <h4 className='text-white font-bold text-sm mb-1 uppercase tracking-tight'>Mente AI Studio</h4>
                    <p className='text-slate-500 text-[11px] leading-relaxed font-medium lowercase'>
                        unleash your creative intelligence with our advanced neural processing platform.
                    </p>
                    <button className='w-full mt-6 py-3 bg-teal-500 text-slate-950 text-[10px] font-black rounded-xl hover:bg-teal-400 transition-all uppercase tracking-widest shadow-lg shadow-teal-500/20 active:scale-95'>
                        Get Started
                    </button>
                </div>
                <RecentMessage />
            </div>
        </div>
    ) : (
        <Loading />
    )
}

export default Feed
