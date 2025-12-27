import React from 'react'
import moment from 'moment'

const Comment = ({ comment }) => {
    return (
        <div className="flex gap-4 p-4 rounded-3xl bg-slate-950/30 border border-slate-800/40 group/comment hover:border-slate-700/50 transition-all duration-300">
            <img
                src={comment.user?.profile_picture}
                alt=""
                className="size-10 rounded-xl object-cover ring-2 ring-slate-800 group-hover/comment:ring-teal-500/30 transition-all"
            />
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                    <p className="text-[12px] font-black text-slate-100 uppercase tracking-tight group-hover/comment:text-teal-400 transition-colors">
                        {comment.user?.full_name}
                    </p>
                    <span className="text-[9px] text-slate-600 font-bold uppercase">
                        {moment(comment.createdAt).fromNow()}
                    </span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                    {comment.text}
                </p>
            </div>
        </div>
    )
}

export default Comment
