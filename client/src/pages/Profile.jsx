import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { dummyPostsData, dummyUserData } from '../assets/assets'
import Loading from '../Components/Loading'
import UserProfileInfo from '../Components/UserProfileInfo'
import PostCard from '../Components/PostCard'
import moment from 'moment'
import ProfileModal from '../Components/ProfileModal'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

const Profile = () => {
    const currentUser = useSelector((state) => state.user.value)
    const { getToken } = useAuth()
    const { profileId } = useParams()
    const [user, setUser] = useState(null)
    const [posts, setPosts] = useState([])
    const [activeTab, setActiveTab] = useState('posts')
    const [showEdit, setShowEdit] = useState(false)

    const fetchUser = async (profileId) => {
        const token = await getToken(); // ✅ add await
        try {
            const { data } = await api.post(`/api/user/profiles`, { profileId }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setUser(data.profile);
                setPosts(data.posts);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };


    useEffect(() => {
        if (profileId) {
            fetchUser(profileId)
        } else if (currentUser?._id) {
            fetchUser(currentUser._id)
        }
    }, [profileId, currentUser])

    return user ? (
        <div className='relative h-full overflow-y-scroll bg-transparent p-6 no-scrollbar'>
            <div className='max-w-4xl mx-auto space-y-8'>
                {/* profile card */}
                <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-[40px] overflow-hidden shadow-2xl shadow-black/40'>
                    {/* cover photo */}
                    <div className='h-48 md:h-64 bg-gradient-to-br from-teal-900/40 via-slate-900 to-purple-900/30 relative overflow-hidden'>
                        {/* Abstract Background Elements */}
                        <div className='absolute top-0 right-0 size-64 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none'></div>
                        <div className='absolute bottom-0 left-0 size-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none'></div>
                        
                        {user.cover_photo && (
                            <img
                                src={user.cover_photo}
                                alt=''
                                className='w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700'
                            />
                        )}
                    </div>
                    {/* user info */}
                    <UserProfileInfo
                        user={user}
                        posts={posts}
                        profileId={profileId}
                        setShowEdit={setShowEdit}
                    />
                </div>

                {/* content section */}
                <div className='space-y-8'>
                    {/* tabs */}
                    <div className='bg-slate-900/50 backdrop-blur-3xl border border-slate-800/60 rounded-[28px] p-2 flex max-w-xl mx-auto shadow-xl'>
                        {['posts', 'media', 'likes'].map((tab) => (
                            <button
                                onClick={() => setActiveTab(tab)}
                                key={tab}
                                className={`flex-1 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 cursor-pointer ${activeTab === tab
                                    ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20'
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* tab content */}
                    <div className='transition-all duration-500'>
                        {activeTab === 'posts' && (
                            <div className='flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700'>
                                {posts.map((post) => (
                                    <PostCard key={post._id} post={post} />
                                ))}
                                {posts.length === 0 && (
                                    <div className='py-24 text-center'>
                                        <p className='text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]'>No signals emitted from this mind yet.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'media' && (
                            <div className='grid grid-cols-2 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700'>
                                {posts
                                    .filter((post) => post.image_urls.length > 0)
                                    .map((post) => (
                                        <React.Fragment key={post._id}>
                                            {post.image_urls.map((image, index) => (
                                                <Link
                                                    target='_blank'
                                                    to={image}
                                                    key={index}
                                                    className='relative group overflow-hidden rounded-[24px] border border-slate-800/60 transition-all hover:border-teal-500/50 aspect-square'
                                                >
                                                    <img
                                                        src={image}
                                                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100'
                                                        alt=''
                                                    />
                                                    <div className='absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity'></div>
                                                    <p className='absolute bottom-4 left-4 right-4 text-[9px] font-black uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition duration-300'>
                                                        {moment(post.createdAt).fromNow()}
                                                    </p>
                                                </Link>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                {posts.filter(p => p.image_urls.length > 0).length === 0 && (
                                     <div className='col-span-full py-24 text-center'>
                                        <p className='text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]'>No visual data stored.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* edit profile modal */}
            {showEdit && <ProfileModal setShowEdit={setShowEdit} />}
        </div>
    ) : (
        <Loading />
    )
}

export default Profile
