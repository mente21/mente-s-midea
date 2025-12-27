import { BadgeCheck, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const StoryViewer = ({ viewStory, setViewStory }) => {

    const [progress, setProgress] = useState(0)
    useEffect(() => {
        let timer, progressInterval;

        if (viewStory && viewStory.media_type !== 'video') {
            setProgress(0)
            const duration = 10000;
            const setTime = 100;
            let elapsed = 0;

            progressInterval = setInterval(() => {
                elapsed += setTime;
                setProgress((elapsed / duration) * 100);
            }, setTime);
            // close story after 10 sec
            timer = setTimeout(() => {
                setViewStory(null)
            }, duration)
        }
        return () => {
            clearTimeout(timer)
            clearInterval(progressInterval)
        }

    }, [viewStory, setViewStory])


    const handleClose = () => {
        setViewStory(null)
    }
    if (!viewStory) return null


    // storyviewer.jsx (FINAL VERSION)

    // ...

    const renderContent = () => {
        switch (viewStory.media_type) {
            case 'image':
                return (
                    <img
                        // 🚩 FINAL FIX 1: Decode the URL before passing it to src
                        src={decodeURI(viewStory.media_url)}
                        alt=''
                        className='max-w-full max-h-screen object-contain'
                    />
                );
            case 'video':
                return (
                    <video
                        onEnded={() => setViewStory(null)}
                        // 🚩 FINAL FIX 2: Decode the URL before passing it to src
                        src={decodeURI(viewStory.media_url)}
                        alt=''
                        className='max-h-screen'
                        controls
                        autoPlay
                    />
                );
            // ...
            case 'text':
                return (
                    <div className='w-full h-full flex items-center justify-center p-8 text-white text-2xl text-center'>
                        {viewStory.content}
                    </div>
                );

            default:
                return null;
        }
    }

    return (
        <div className='fixed inset-0 h-screen bg-slate-950/95 backdrop-blur-3xl z-[120] flex items-center justify-center overflow-hidden' style={{ backgroundColor: viewStory.media_type === 'text' ? `${viewStory.background_color}CC` : undefined }}>
            {/* Neural Background Glows */}
            <div className='absolute top-1/4 left-1/4 size-96 bg-teal-500/10 rounded-full blur-[150px] animate-pulse'></div>
            <div className='absolute bottom-1/4 right-1/4 size-96 bg-purple-600/10 rounded-full blur-[150px] animate-pulse delay-700'></div>

            {/* Neuro-Progress Bar */}
            <div className='absolute top-0 left-0 w-full h-[3px] bg-slate-900/50 backdrop-blur-md z-20'>
                <div 
                    className='h-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-100 linear shadow-[0_0_15px_rgba(45,212,191,0.6)] shadow-teal-500/40' 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Node Sync Info (Top Left) */}
            <div className='absolute top-8 left-8 flex items-center gap-4 p-3 pr-6 bg-slate-900/40 backdrop-blur-3xl border border-slate-800/60 rounded-[20px] shadow-2xl z-20 group transition-all hover:bg-slate-900/60'>
                <div className='relative'>
                    <img 
                        src={viewStory.user?.profile_picture} 
                        alt='' 
                        className='size-10 rounded-xl object-cover ring-2 ring-slate-800 group-hover:ring-teal-500/50 transition-all duration-500' 
                    />
                    <div className='absolute -bottom-1 -right-1 size-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full shadow-lg'></div>
                </div>
                <div>
                    <div className='flex items-center gap-1.5'>
                        <span className='font-black text-slate-100 uppercase tracking-tight text-[13px]'>{viewStory.user?.full_name}</span>
                        <BadgeCheck className='w-4 h-4 text-teal-400 fill-teal-400/10' />
                    </div>
                    <p className='text-[8px] text-teal-400 font-black uppercase tracking-widest -mt-0.5 opacity-60'>Neural Sync Active</p>
                </div>
            </div>

            {/* Close Command (Top Right) */}
            <button 
                onClick={handleClose} 
                className='absolute top-8 right-8 size-12 flex items-center justify-center bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl text-slate-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300 z-20 cursor-pointer active:scale-90 group'
            >
                <X className='w-6 h-6 group-hover:rotate-90 transition-transform duration-500' />
            </button>

            {/* Insight Container */}
            <div className='w-full h-full flex items-center justify-center relative z-10 p-4 md:p-12'>
                <div className='max-w-[95vw] max-h-[95vh] flex items-center justify-center animate-in zoom-in-95 duration-500'>
                    {renderContent()}
                </div>
            </div>
            
            {/* Timestamp Overlay */}
            <div className='absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 px-5 py-2 rounded-full z-20 shadow-2xl'>
                <p className='text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]'>
                    Fragment Captured: <span className='text-slate-300'>Live</span>
                </p>
            </div>
        </div>
    )
}

export default StoryViewer