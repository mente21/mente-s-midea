import React from 'react'
import { menuItemsData } from '../assets/assets'
import { NavLink } from 'react-router-dom'

const MenuItems = ({ setSidebarOpen }) => {
    return (
        <div className='px-4 text-slate-400 space-y-2 font-bold text-sm tracking-wide'>
            {
                menuItemsData.map(({ to, label, Icon }) => (
                    <NavLink 
                        key={to} 
                        to={to} 
                        end={to === '/'} 
                        onClick={() => setSidebarOpen(false)} 
                        className={({ isActive }) => `
                            group px-4 py-3 flex items-center gap-4 rounded-2xl transition-all duration-300
                            ${isActive 
                                ? 'bg-gradient-to-r from-teal-500/10 to-transparent text-teal-400 border-l-4 border-teal-500 shadow-sm shadow-teal-500/5' 
                                : 'hover:bg-slate-900/80 hover:text-slate-100 hover:translate-x-1'
                            }
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                {Icon && <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(45,212,191,0.4)]' : 'group-hover:scale-110'}`} />}
                                <span>
                                    {label}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))
            }
        </div>
    )
}

export default MenuItems