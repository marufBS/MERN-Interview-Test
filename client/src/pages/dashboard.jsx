import React from 'react'
import { IoMdAdd } from "react-icons/io";
import { IoAdd } from "react-icons/io5";
const Dashboard = () => {

    const data = [1, 2, 3, 4, 5, 6]
    return (
        <div className='flex-1 flex justify-center items-center p-20'>
            <div className=' w-full h-full  shadow-2xl flex gap-6 flex-wrap p-5'>
                {
                    data.map((d, i) => (
                        <div className='w-80 h-80 bg-slate-200 rounded-md'>hello</div>
                    ))
                }
                <div className='relative'>
                    <div className='w-80 h-80 bg-slate-50 rounded-md flex justify-center items-center'>
                        <div className='absolute inset-0 flex justify-center items-center'>
                            <IoAdd size={200} color='#9c9c9c' />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Dashboard