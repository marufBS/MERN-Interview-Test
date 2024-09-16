import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { IoAdd } from "react-icons/io5";
import './dashboard.css'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { setDrawingTitle } from '../components/drawingpadSlice';
import { MdOutlineDeleteForever } from "react-icons/md";
const Dashboard = () => {
    const navigate = useNavigate()
    const [drawings, setDrawings] = useState([]);
    const dispatch = useDispatch()

    useEffect(() => {
        axios.get("http://localhost:5000/api/drawings")
            .then((res) => {
                if (!res.data.error) {
                    setDrawings(res.data.drawings)
                }
            })
    }, [])

    const handleCreateNewDrawing = () => {
        axios.post('http://localhost:5000/api/drawing')
            .then((res) => {
                console.log(res)
                if (res.data.error === false) {
                    let id = res.data.drawing._id
                    navigate(`/drawing/${id}`);
                }
            })

    }
    // console.log(drawings)

    const handleOpenDrawing = (d) => {
        const currentCanvas = drawings.find((item) => item._id === d._id)
        // const currentCanvasTitle = drawings.find
        console.log("sdflksdf=>", currentCanvas)
        dispatch(setDrawingTitle(d.drawingTitle))
        // dispatch(setDrawingCanvas(currentCanvas.canvas))
        navigate(`/drawing/${d._id}`)
    }
    return (
        <div className='flex-1 flex justify-center items-center p-10 bg-red-300 overflow-hidden'>
            <div className='rounded-md  overflow-auto h-full w-full shadow-2xl grid  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-5 bg-slate-500 items-start'>
                <div onClick={handleCreateNewDrawing} className='pointer-events-auto relative transition ease-in-out delay-350 hover:bg-slate-300 w-full h-80 bg-slate-200 rounded-md'>
                    <div className='flex justify-center items-center'>
                        <div className='absolute inset-0 flex justify-center items-center'>
                            <IoAdd size={200} color='#9c9c9c' />
                        </div>
                    </div>
                </div>
                {
                    drawings.map((item, i) => (
                        <div key={item._id} onClick={() => handleOpenDrawing(item)} className='flex flex-col justify-around w-full h-80 transition ease-in-out delay-50 hover:bg-slate-300 bg-slate-200 rounded-md'>
                            <img className='bg-slate-400 flex-1 rounded-t-md' src={item.canvasThumbnail} alt="" />
                            <div className='flex justify-between p-3'>
                                <div className='text-xl'>{item.drawingTitle}</div>
                                <div className='flex justify-center items-center'>
                                    <button type="button" class="text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-1 text-center inline-flex items-center me-2 ">
                                        <MdOutlineDeleteForever size={25}/>
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))
                }
            </div>

        </div>
    )
}

export default Dashboard