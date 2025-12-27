// @ts-nocheck
import React, { useState } from 'react'
import Sidebar from '../Components/Sidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { dummyUserData } from '../assets/assets'
import Loading from '../Components/Loading'
import { useSelector } from 'react-redux'
import { useClerk } from '@clerk/clerk-react'





const LayOut = () => {
    const { value: user, isLoading, error } = useSelector((state) => state.user)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { signOut } = useClerk()
    const navigate = useNavigate()

    if (isLoading) {
        return <Loading />
    }

    if (error) {
        return (
            <div className='flex flex-col items-center justify-center h-screen bg-[#020617] gap-8 p-6 text-center overflow-hidden relative'>
                {/* Error Background Glows */}
                <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/10 rounded-full blur-[120px] pointer-events-none'></div>

                <div className='relative z-10'>
                    <div className='size-24 bg-red-500/10 border border-red-500/30 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-500/10 animate-pulse'>
                        <X className='w-12 h-12 text-red-500 stroke-[3]' />
                    </div>
                    <div className='space-y-4'>
                        <h2 className='text-4xl font-black text-slate-100 uppercase tracking-tighter'>Neural <span className='text-red-500'>Desync</span></h2>
                        <p className='text-slate-500 font-bold text-xs uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed'>
                            Connection established but the cloud reporting an anomaly. <br/>
                            <span className='text-slate-700 mt-2 block'>ID: {error.substring(0, 30)}...</span>
                        </p>
                    </div>
                    <div className='flex flex-col sm:flex-row gap-4 mt-12 justify-center'>
                        <button 
                            onClick={() => window.location.reload()}
                            className='px-10 py-4 bg-slate-900 text-slate-100 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-800 transition-all border border-slate-800 active:scale-95 shadow-xl'
                        >
                            Retry Handshake
                        </button>
                        <button 
                            onClick={() => signOut(() => navigate('/'))}
                            className='px-10 py-4 bg-red-500/10 text-red-500 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-red-500/20 transition-all border border-red-500/30 active:scale-95'
                        >
                            Purge Credentials
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return user ? (
        <div className='w-full flex h-screen bg-[#020617] text-slate-200 relative overflow-hidden selection:bg-teal-500/30'>
            {/* Ambient Background Signals */}
            <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none neural-glow'></div>
            <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none neural-glow delay-1000'></div>

            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className='flex-1 relative h-screen z-10'>
                <div className='h-full overflow-hidden'>
                    <Outlet />
                </div>
            </div>

            {sidebarOpen ? (
                <X
                    className='absolute top-6 right-6 p-2 z-[100] bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl w-12 h-12 text-slate-200 sm:hidden transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer'
                    onClick={() => setSidebarOpen(false)}
                />
            ) : (
                <Menu
                    className='absolute top-6 right-6 p-2 z-[50] bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl w-12 h-12 text-slate-200 sm:hidden transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer'
                    onClick={() => setSidebarOpen(true)}
                />
            )}
        </div>
    ) : (
        <div className='bg-[#020617] h-screen w-full flex items-center justify-center overflow-hidden'>
            <Loading />
        </div>
    )
}

export default LayOut
