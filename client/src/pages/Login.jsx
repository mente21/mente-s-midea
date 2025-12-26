import React from 'react'
import { assets } from '../assets/assets'
import { Star, Users } from 'lucide-react'
import { SignIn } from '@clerk/clerk-react'

const Login = () => {
    return (
        <div className='min-h-screen flex flex-col md:flex-row relative'>
            {/* Background image */}
            <img
                src={assets.bgImage}
                alt=''
                className='absolute top-0 left-0 -z-10 w-full h-full object-cover'
            />

            {/* Left side branding */}
            <div className='flex-1 flex flex-col items-start justify-between p-6 md:p-10 lg:pl-40'>
                {/* Logo with added spacing */}
                <div className='flex items-center gap-2.5 mb-8 md:mb-12'>
                    <div className='bg-gradient-to-br from-indigo-600 to-indigo-800 p-1.5 rounded-lg text-white shadow-md'>
                        <Users className='w-6 h-6 md:w-8 md:h-8' />
                    </div>
                    <span className='text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent tracking-tighter leading-normal'>
                        PingUp
                    </span>
                </div>

                <div>
                    <div className='flex items-center gap-3 mb-6 max-md:mt-10'>
                        <img src={assets.group_users} alt='' className='h-8 md:h-10' />
                        <div>
                            <div className='flex'>
                                {Array(5)
                                    .fill(0)
                                    .map((_, i) => (
                                        <Star
                                            key={i}
                                            className='size-4 md:size-4.5 text-transparent fill-amber-500'
                                        />
                                    ))}
                            </div>
                            <p className='text-sm md:text-base text-gray-700'>
                                Used By 12K Developers
                            </p>
                        </div>
                    </div>

                    {/* Smaller headline */}
                    <h1
                        className='text-2xl md:text-5xl font-bold bg-gradient-to-r
          from-indigo-950 to-indigo-800 bg-clip-text text-transparent leading-tight'
                    >
                        More than just friends truly connect
                    </h1>

                    <p className='text-lg md:text-2xl text-indigo-900 max-w-72 md:max-w-md mt-2'>
                        Connect with global community on PingUp.
                    </p>
                </div>

                <span className='md:h-10'></span>
            </div>

            {/* Right side login form */}
            <div className='flex-1 flex items-center justify-center p-6 sm:p-10'>
                <SignIn />
            </div>
        </div>
    )
}

export default Login
