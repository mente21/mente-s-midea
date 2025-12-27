import React from 'react'
import { assets, dummyUserData } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import MenuItems from './MenuItems'
import { CirclePlus, LogOut, Brain } from 'lucide-react'
import { UserButton, useClerk } from '@clerk/clerk-react'
import { useSelector } from 'react-redux'


const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const navigate = useNavigate()
    const user = useSelector((state) => state.user.value)
    const { signOut } = useClerk()

    return (
        <div
            className={`w-64 xl:w-80 bg-slate-950 border-r border-slate-800/50 flex flex-col justify-between max-sm:absolute top-0 bottom-0 z-30 ${sidebarOpen ? 'translate-x-0' : 'max-sm:-translate-x-full'
                } transition-all duration-500 ease-in-out shadow-2xl shadow-black/50`}
        >
            {/* --- Top Section --- */}
            <div className='w-full'>
                <div
                    onClick={() => navigate('/')}
                    className='flex items-center gap-3 px-8 my-8 cursor-pointer group'
                >
                    <div className='bg-gradient-to-br from-teal-400 to-cyan-500 p-2.5 rounded-xl text-white shadow-lg shadow-teal-500/20 group-hover:rotate-12 transition-all duration-300'>
                        <Brain className='w-6 h-6 stroke-[2.5]' />
                    </div>
                    <span className='text-2xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tighter'>
                        Mente
                    </span>
                </div>

                <div className='px-2'>
                    <MenuItems setSidebarOpen={setSidebarOpen} />
                </div>

                <div className='px-6 mt-10'>
                    <Link
                        to={'/create-post'}
                        className='flex items-center justify-center gap-2 py-3.5 w-full rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 active:scale-[0.98] transition-all text-slate-950 font-extrabold text-sm shadow-lg shadow-teal-500/20 group uppercase tracking-wider'
                    >
                        <CirclePlus className='w-5 h-5 group-hover:rotate-90 transition-transform duration-500' />
                        New Connect
                    </Link>
                </div>
            </div>

            {/* --- Bottom Profile Section --- */}
            <div className='w-full p-4 mb-4'>
                <div className='bg-slate-900/40 border border-slate-800/50 p-4 rounded-2xl flex items-center justify-between group hover:bg-slate-900 transition-colors shadow-inner'>
                    <div className='flex gap-3 items-center overflow-hidden'>
                        <div className='ring-2 ring-teal-500/20 rounded-full p-0.5 group-hover:ring-teal-500/50 transition-all'>
                            <UserButton 
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: 'w-10 h-10'
                                    }
                                }}
                            />
                        </div>
                        <div className='min-w-0'>
                            <h1 className='text-sm font-bold text-white truncate'>{user?.full_name || 'Mente User'}</h1>
                            <p className='text-[10px] text-slate-500 font-bold uppercase tracking-tighter'>@{user?.username || 'user'}</p>
                        </div>
                    </div>
                    <button 
                         onClick={() => signOut()}
                         className='p-2 hover:bg-red-500/10 rounded-lg text-slate-600 hover:text-red-400 transition-all'
                    >
                        <LogOut className='w-4.5 h-4.5' />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
