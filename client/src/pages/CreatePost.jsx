import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'
import { X } from 'lucide-react'
import { Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

const CreatePost = () => {

    const navigate = useNavigate()
    const [content, setContent] = useState('')
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(false)

    const user = useSelector((state) => state.user.value)

    const { getToken } = useAuth()
    const handleSubmit = async () => {
        if (!images.length && !content) {
            return toast.error('Please add at least one image or text')
        }
        setLoading(true)

        const postType = images.length && content ? 'text_with_image' : images.length ? 'image' : 'text'
        try {
            const formData = new FormData();
            formData.append('content', content)
            formData.append('post_type', postType)
            images.map((image) => {
                formData.append('images', image)
            })
            const { data } = await api.post('/api/post/add', formData, {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            })
            if (data.success) {
                navigate('/')
            } else {
                console.log(data.message)
                throw new Error(data.message)
            }
        } catch (error) {
            console.log(error.message)
            throw new Error(error.message)

        }
    }

    return (
        <div className='min-h-screen bg-transparent h-full overflow-y-scroll no-scrollbar'>
            <div className='max-w-6xl mx-auto p-8'>
                {/* header */}
                <div className='mb-10'>
                    <h1 className='text-4xl font-black text-slate-100 mb-2 uppercase tracking-tighter'>
                        New <span className='text-teal-400'>Connect</span>
                    </h1>
                    <p className='text-slate-500 font-bold text-xs uppercase tracking-widest'>Share your cognitive insights with the network.</p>
                </div>

                {/* form core */}
                <div className='max-w-xl bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[40px] border border-slate-800/60 shadow-2xl shadow-black/40 space-y-8 group transition-all duration-500 hover:border-slate-700'>
                    {/* identity */}
                    <div className='flex items-center gap-4'>
                        <div className='relative'>
                            <img
                                src={user?.profile_picture}
                                alt=''
                                className='size-14 rounded-2xl shadow-2xl ring-2 ring-slate-800 object-cover'
                            />
                            <div className='absolute -bottom-1 -right-1 size-4 bg-teal-500 border-2 border-slate-900 rounded-lg'></div>
                        </div>
                        <div>
                            <h2 className='font-black text-slate-100 uppercase tracking-tight'>{user?.full_name}</h2>
                            <p className='text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-0.5'>@{user?.username}</p>
                        </div>
                    </div>

                    {/* neural input zone */}
                    <div className='relative'>
                        <textarea
                            className='w-full bg-slate-950/30 border border-slate-800/50 rounded-2xl p-6 min-h-[160px] resize-none text-[15px] text-slate-200 outline-none placeholder:text-slate-700 font-medium leading-relaxed transition-all focus:border-teal-500/30 focus:ring-4 focus:ring-teal-500/5'
                            placeholder="WHAT'S EXPLODING IN YOUR MIND?"
                            onChange={(e) => setContent(e.target.value)}
                            value={content}
                        />
                    </div>

                    {/* visual fragments */}
                    {images.length > 0 && (
                        <div className='flex flex-wrap gap-3 p-2 bg-slate-950/20 rounded-2xl border border-slate-800/30'>
                            {images.map((image, i) => (
                                <div key={i} className='relative group/img overflow-hidden rounded-xl border border-slate-800/50'>
                                    <img
                                        src={URL.createObjectURL(image)}
                                        className='h-24 w-24 object-cover group-hover/img:scale-110 transition-transform duration-500'
                                        alt=''
                                    />
                                    <div
                                        onClick={() =>
                                            setImages(images.filter((_, index) => index !== i))
                                        }
                                        className='absolute inset-0 bg-slate-950/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer'
                                    >
                                        <X className='w-6 h-6 text-red-400' />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Command Bar */}
                    <div className='flex items-center justify-between pt-6 border-t border-slate-800/80'>
                        <label htmlFor="images" className='flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-teal-400 transition-all cursor-pointer border border-slate-700/50 group/btn'>
                            <ImageIcon className='w-5 h-5 group-hover/btn:rotate-12 transition-transform' />
                            <span className='text-[10px] font-black uppercase tracking-widest'>Add Media</span>
                        </label>

                        <input type="file" id="images" accept='image/*' hidden multiple onChange={(e) => setImages([...images, ...e.target.files])} />
                        
                        <button
                            disabled={loading}
                            onClick={() =>
                                toast.promise(
                                    handleSubmit,
                                    {
                                        loading: 'Broadcasting insight...',
                                        success: <p className='font-bold uppercase tracking-widest text-[10px]'>Signal Transmitted</p>,
                                        error: <p className='font-bold uppercase tracking-widest text-[10px]'>Broadcast Failed</p>,
                                    }
                                )
                            }
                            className='bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-black text-[10px] uppercase tracking-[0.2em] px-10 py-4 rounded-xl shadow-xl shadow-teal-500/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer'
                        >
                            Publish Insight
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatePost
