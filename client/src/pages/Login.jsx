import React from 'react'
import { Brain } from 'lucide-react'
import { SignIn } from '@clerk/clerk-react'

const Login = () => {
    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black relative overflow-hidden'>
            {/* Abstract Background Shapes */}
            <div className='absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none'>
                <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/20 rounded-full blur-[120px]'></div>
                <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[120px]'></div>
            </div>

            <div className='z-10 w-full max-w-5xl flex flex-col md:flex-row items-center justify-between p-6 md:p-12 gap-12'>
                
                {/* Left Side: Brand & Welcome */}
                <div className='flex-1 text-center md:text-left space-y-8'>
                    {/* New Logo */}
                    <div className='inline-flex items-center gap-3 mb-4'>
                        <div className='bg-gradient-to-br from-teal-400 to-cyan-500 p-2.5 rounded-xl shadow-lg shadow-teal-500/20'>
                            <Brain className='w-8 h-8 text-white stroke-[2.5]' />
                        </div>
                        <span className='text-3xl md:text-4xl font-black text-white tracking-tight'>
                            Mente's App
                        </span>
                    </div>

                    <div className='space-y-4'>
                        <h1 className='text-4xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight'>
                            Ignite Your <br />
                            <span className='text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400'>
                                Digital World
                            </span>
                        </h1>
                        <p className='text-slate-400 text-lg md:text-xl max-w-md mx-auto md:mx-0 font-medium'>
                            Experience a new era of social connection. Fast, secure, and uniquely yours. Join the revolution today.
                        </p>
                    </div>

                    {/* Feature Pills */}
                    <div className='flex flex-wrap gap-3 justify-center md:justify-start pt-2'>
                        {['Fast', 'Secure', 'Modern'].map((tag) => (
                            <div key={tag} className='px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-teal-300 text-sm font-semibold'>
                                {tag}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className='flex-1 w-full max-w-md flex justify-center'>
                     <SignIn />
                </div>
            </div>
        </div>
    )
}

export default Login
