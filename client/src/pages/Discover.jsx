import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import UserCard from '../Components/UserCard'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import { useDispatch } from 'react-redux'
import { fetchUser } from '../features/user/userSlice'
import toast from 'react-hot-toast'

const Discover = () => {
    const dispatch = useDispatch()
    const [input, setInput] = useState('')
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const { getToken } = useAuth()

    const fetchUsers = async (searchTerm = '') => {
        try {
            setLoading(true)
            const token = await getToken()
            const { data } = await api.post(
                '/api/user/discover',
                { input: searchTerm },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )

            if (data.success) {
                setUsers(data.users)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async (e) => {
        if (e.key === 'Enter') {
            setUsers([])
            await fetchUsers(input)
            setInput('')
        }
    }

    useEffect(() => {
        const loadInitialData = async () => {
            // FIX: Removed dispatch(fetchUser(token)) to prevent infinite re-rendering loop
            // The user is already fetched in App.jsx and LayOut handles loading state.
            fetchUsers() // Fetch all users on mount
        }
        loadInitialData()
    }, [])

    return (
        <div className='min-h-screen bg-transparent h-full overflow-y-scroll no-scrollbar'>
            <div className='max-w-6xl mx-auto p-8'>
                {/* header */}
                <div className='mb-10'>
                    <h1 className='text-4xl font-black text-slate-100 mb-2 uppercase tracking-tighter'>
                        Discover <span className='text-teal-400'>Intelligence</span>
                    </h1>
                    <p className='text-slate-500 font-bold text-xs uppercase tracking-widest'>
                        Connect with global minds and expand your neural network.
                    </p>
                </div>

                {/* search area */}
                <div className='mb-12 bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[40px] border border-slate-800/60 shadow-2xl shadow-black/40 group'>
                    <div className='relative max-w-3xl'>
                        <Search className='absolute left-5 top-1/2 -translate-y-1/2 text-teal-500/50 group-focus-within:text-teal-400 w-5 h-5 transition-colors' />
                        <input
                            type='text'
                            placeholder='SEARCH BY NAME, USERNAME, OR INTELLECTUAL BIO...'
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            onKeyUp={handleSearch}
                            className='pl-14 pr-6 py-5 w-full bg-slate-950/50 border border-slate-800/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all text-slate-200 text-xs font-black placeholder:text-slate-600 uppercase tracking-widest'
                        />
                    </div>
                </div>

                {/* user list grid */}
                <div className='flex flex-wrap gap-8 justify-center sm:justify-start'>
                    {users.map((user) => (
                        <UserCard user={user} key={user._id} />
                    ))}
                </div>

                {/* empty state */}
                {!loading && users.length === 0 && (
                     <div className='flex flex-col items-center justify-center w-full py-32 text-center animate-in fade-in duration-700'>
                        <div className='size-20 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center mb-6 shadow-2xl'>
                            <Search className='w-8 h-8 text-slate-700' />
                        </div>
                        <h3 className='text-slate-400 font-bold uppercase tracking-widest text-xs'>No results in this coordinate</h3>
                        <p className='text-slate-600 text-[10px] mt-2 font-black uppercase tracking-[0.2em]'>Try adjusting your neural search filters.</p>
                    </div>
                )}

                {/* loading bridge */}
                {loading && (
                    <div className='flex flex-col justify-center items-center h-[40vh] gap-4'>
                        <div className='size-12 rounded-full border-4 border-teal-500/20 border-t-teal-500 animate-spin shadow-[0_0_15px_rgba(45,212,191,0.2)]'></div>
                        <p className='text-teal-400/50 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse'>Synchronizing Data...</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Discover
