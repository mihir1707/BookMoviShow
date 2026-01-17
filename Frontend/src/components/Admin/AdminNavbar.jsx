import React from 'react'
import { Link } from 'react-router-dom'

function AdminNavbar() {
    return (
        <div className='flex items-center justify-between px-6 md:px-10 h-16 border-b border-gray-300/30'>
            <Link to='/'>
                <p className='text-4xl [-webkit-text-stroke:2px_black] font-extrabold bg-primary rounded-full pl-2 pr-2 hover:bg-primary-dull'>BookMoviShow</p>
            </Link>
        </div>
    )
}

export default AdminNavbar
