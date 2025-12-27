import { useAuth } from '@clerk/clerk-react'
import { ArrowLeft, Sparkle, Type, Upload } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../api/axios'

const StoryModal = ({ setShowModal, fetchStories }) => {
  const bgColors = ["#4f46e5", "#7c3aed", "#db2777", "#e11d48", "#ca8a04", "#0d9488"]

  const [mode, setMode] = useState("text")
  const [background, setBackground] = useState(bgColors[0])
  const [text, setText] = useState("")
  const [media, setMedia] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const { getToken } = useAuth()

  const MAX_VIDEO_DURATION = 60 // seconds
  const MAX_VIDEO_SIZE_MB = 50 // MB

  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type.startsWith("video")) {
      if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
        toast.error(`Video file size cannot exceed ${MAX_VIDEO_SIZE_MB}MB.`)
        setMedia(null)
        setPreviewUrl(null)
        return
      }

      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src)
        if (video.duration > MAX_VIDEO_DURATION) {
          toast.error("Video duration cannot exceed 1 minute.")
          setMedia(null)
          setPreviewUrl(null)
        } else {
          setMedia(file)
          setPreviewUrl(URL.createObjectURL(file))
          setText('')
          setMode("media")
        }
      }
      video.src = URL.createObjectURL(file)
    } else if (file.type.startsWith("image")) {
      setMedia(file)
      setPreviewUrl(URL.createObjectURL(file))
      setText('')
      setMode("media")
    }
  }


  // storymodel.jsx (Replace the whole function)
  const handleCreateStory = async () => {
    const media_type = mode === 'media'
      ? media?.type.startsWith('image')
        ? 'image'
        : 'video'
      : 'text'

    if (media_type === "text" && !text) {
      // Throw instead of returning toast.error
      throw new Error("Please enter some text")
    }

    const formData = new FormData()
    formData.append('content', text)
    formData.append('media_type', media_type)
    formData.append('media', media)
    formData.append('background_color', background)

    try {
      const token = await getToken()
      const { data } = await api.post('/api/story/create', formData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (data.success) {
        // On success, perform side effects and RETURN data (resolves toast promise)
        setShowModal(false)
        fetchStories()
        return data;
      } else {
        // If the server reports failure, THROW an error to reject the toast promise
        throw new Error(data.message || 'Server reported failure')
      }
    } catch (error) {
      // Re-throw any network or unhandled error to reject the toast promise
      throw new Error(error.response?.data?.message || error.message || "An unknown error occurred")
    }
  }

  return (
    <div className="fixed inset-0 z-110 min-h-screen bg-slate-950/90 backdrop-blur-2xl text-slate-100 flex items-center justify-center p-6 no-scrollbar overflow-y-auto">
      <div className="w-full max-w-lg flex flex-col items-center animate-in zoom-in-95 duration-500">

        {/* Header */}
        <div className="w-full flex items-center justify-between mb-8">
          <button onClick={() => setShowModal(false)} className="text-slate-400 p-3 hover:text-white hover:bg-slate-900/50 rounded-2xl transition-all cursor-pointer">
            <ArrowLeft className='w-6 h-6' />
          </button>
          <div className='text-center'>
             <h2 className="text-2xl font-black uppercase tracking-tighter">Neural <span className='text-teal-400'>Moment</span></h2>
             <p className='text-[10px] text-slate-500 font-bold uppercase tracking-widest'>Fragment your consciousness into the network.</p>
          </div>
          <span className="w-12"></span>
        </div>

        {/* Story Workspace Area */}
        <div
          className="rounded-[40px] h-[500px] w-full flex items-center justify-center relative overflow-hidden shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50 group"
          style={{ backgroundColor: background }}
        >
          {mode === 'text' && (
            <textarea
              className="bg-transparent text-white w-full h-full p-12 text-2xl font-black resize-none focus:outline-none text-center flex items-center justify-center pt-32 placeholder:text-white/20 tracking-tight leading-tight"
              placeholder="WHAT'S FLASHING IN THE VOID?"
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
          )}

          {mode === 'media' && previewUrl && (
            <div className='size-full relative'>
               {media?.type.startsWith('image')
                ? <img src={previewUrl} alt='' className='size-full object-cover group-hover:scale-105 transition-transform duration-1000' />
                : <video src={previewUrl} className='size-full object-cover group-hover:scale-105 transition-transform duration-1000' autoPlay loop muted />
               }
               <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60'></div>
            </div>
          )}
        </div>

        {/* Workspace Controls */}
        <div className='w-full max-w-sm'>
          <div className='flex justify-center mt-6 gap-3'>
            {bgColors.map((color) => (
              <button
                key={color}
                className={`w-7 h-7 rounded-full ring-2 transition-all cursor-pointer hover:scale-110 ${background === color ? 'ring-teal-400 scale-125 shadow-[0_0_15px_rgba(45,212,191,0.4)]' : 'ring-slate-800'}`}
                style={{ backgroundColor: color }}
                onClick={() => setBackground(color)}
              />
            ))}
          </div>

          <div className='flex gap-3 mt-8 bg-slate-900/50 p-2 rounded-2xl border border-slate-800/80'>
            <button
              onClick={() => { setMode('text'); setMedia(null); setPreviewUrl(null) }}
              className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest ${mode === 'text' ? "bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/10" : "text-slate-500 hover:text-slate-300"}`}
            >
              <Type size={16} /> Text
            </button>

            <label
              className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest cursor-pointer ${mode === 'media' ? "bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/10" : "text-slate-500 hover:text-slate-300"}`}
            >
              <input
                onChange={handleMediaUpload}
                type="file"
                accept='image/*,video/*'
                className='hidden'
              />
              <Upload size={16} /> Vision
            </label>
          </div>

          <button
            onClick={() => toast.promise(handleCreateStory(), {
              loading: 'Projecting signal...',
              success: 'Moment Synced',
              error: (e) => e.message || 'Projection Failed'
            })}
            className='flex items-center justify-center gap-3 text-slate-950 py-4 mt-6 w-full rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-teal-500/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer'
          >
            <Sparkle size={18} />Broadcast Moment
          </button>
        </div>
      </div>
    </div>
  )
}

export default StoryModal
