import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { IoAdd } from "react-icons/io5";
import './dashboard.css'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { setDrawingTitle } from '../components/drawingpadSlice';
import { MdOutlineDeleteForever } from "react-icons/md";
import Loader from '../components/loader';
const Dashboard = () => {
    const Vercel_URL = "https://mern-interview-test-server-kappa.vercel.app"
    const navigate = useNavigate()
    const [drawings, setDrawings] = useState([]);
    const [update, setUpdate] = useState(false)
    const [isLoading,setIsLoading] = useState(true)
    const dispatch = useDispatch()

    useEffect(() => {
        axios.get(`${Vercel_URL}/api/drawings`)
            .then((res) => {
                if (!res.data.error) {
                    setDrawings(res.data.drawings)
                    setIsLoading(false)
                }
            })
    }, [update])

    const handleCreateNewDrawing = () => {
        dispatch(setDrawingTitle('Untitled Drawing'))
        axios.post(`${Vercel_URL}/api/drawing`)
            .then((res) => {
                console.log(res)
                if (res.data.error === false) {
                    let id = res.data.drawing._id
                    navigate(`/drawing/${id}`);
                }
            })

    }

    const handleOpenDrawing = (d) => {
        const currentCanvas = drawings.find((item) => item._id === d._id)
        // const currentCanvasTitle = drawings.find
        // console.log("sdflksdf=>", currentCanvas)
        dispatch(setDrawingTitle(d.drawingTitle))
        // dispatch(setDrawingCanvas(currentCanvas.canvas))
        navigate(`/drawing/${d._id}`)
    }

    const handleDeleteDrawing = (id) => {
        if (window.confirm("Are you sure you want to delete ?") == true) {

            axios.delete(`${Vercel_URL}/api/drawing/${id}`)
                .then((res) => {
                    if (!res.data.error) {
                        setUpdate(!update)
                        alert('Drawing Deleted Successfully')
                    } else {
                        alert('Failed to delete the drawing')
                    }
                })


        } else {
            alert('you cancelled')
        }
    }
    return (
        <div className='flex-1 flex justify-center items-center overflow-hidden'>
            <div className='overflow-auto h-full w-full shadow-2xl grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-5 bg-slate-200 items-start'>
                <div onClick={handleCreateNewDrawing} className='border-2 border-gray-500 pointer-events-auto relative transition ease-in-out delay-350 hover:bg-slate-300 w-full h-80 bg-slate-200 rounded-md'>
                    <div className='flex justify-center items-center'>
                        <div className='absolute inset-0 flex justify-center items-center'>
                            <IoAdd size={200} color='#9c9c9c' />
                        </div>
                    </div>
                </div>
                {
                    drawings.map((item, i) => (
                        <div key={item._id} className='border-2 border-gray-500 flex flex-col justify-around w-full h-80 transition ease-in-out delay-50 hover:bg-slate-300 bg-slate-200 rounded-md'>
                            <img onClick={() => handleOpenDrawing(item)} className='bg-slate-400 flex-1 rounded-t-md' src={item.canvasThumbnail} alt="" />
                            <div className='flex justify-between p-3'>
                                <p className='text-xl text-ellipsis overflow-hidden block'>{item.drawingTitle ? item.drawingTitle : 'Untitled Drawing'}</p>
                                <div className='flex justify-center items-center'>
                                    <button onClick={() => handleDeleteDrawing(item._id)} type="button" className="text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-1 text-center inline-flex items-center me-2 ">
                                        <MdOutlineDeleteForever size={25} />
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))
                }
                {
                    isLoading &&
                    <div className='absolute inset-0 w-full h-full flex justify-center items-center'>
                        <Loader />
                    </div>
                }
            </div>

        </div>
    )
}

export default Dashboard