// Navbar.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { setDrawingCanvas, setDrawingTitle } from './drawingpadSlice';
import axios from 'axios';

const Navbar = () => {
    const Vercel_URL = "https://mern-interview-test-server-kappa.vercel.app"
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch()
    const reduxCanvas = useSelector((state) => state.drawing.drawingCanvas);
    const reduxDrawingTitle = useSelector((state) => state.drawing.drawingTitle)
    const drawingThumbnail = useSelector((state) => state.drawing.drawingThumbnail)
    const canvasBase64 = useSelector((state)=>state.drawing.canvasBase64)
    const { id } = useParams()
    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const saveDrawing = async() => {
        axios.put(`${Vercel_URL}/api/drawing/${id}`, {
            drawingTitle: reduxDrawingTitle,
            canvas: reduxCanvas,
            drawingThumbnail: drawingThumbnail
        }).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })


    };

    const handleDashboard = ()=>{
        dispatch(setDrawingCanvas(null))
    }



    return (
        <nav className="bg-white border-gray-200 shadow">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4">
                <input
                    className='focus:outline-none border-2 border-white hover:border-black rounded-lg text-center text-xl py-1'
                    onChange={(e) => dispatch(setDrawingTitle(e.target.value))}
                    onKeyDown={(e) => {
                        // if (e.key === 'Enter') setIsInput(false);
                    }}
                    defaultValue={reduxDrawingTitle ? reduxDrawingTitle : 'Untitled Drawing'}
                />
                <button
                    type="button"
                    className="inline-flex justify-center items-center p-2 w-10 h-10 rounded-lg md:hidden hover:shadow text-emerald-300 hover:bg-emerald-100"
                    onClick={toggleNavbar}
                    aria-controls="navbar-default"
                    aria-expanded={isOpen}
                >
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div
                    className={`w-full md:block md:w-auto ${isOpen ? 'block' : 'hidden'}`}
                    id="navbar-default"
                >
                    <ul className={`font-medium flex flex-col p-4 mt-4 border border-gray-100 rounded-lg md:flex-row gap-4 md:mt-0 md:border-0 bg-white`}>
                        <li onClick={saveDrawing}>

                            <button className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                    Update
                                </span>
                            </button>

                        </li>
                        <li onClick={handleDashboard}>
                            <Link to="/dashboard">
                                <button className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                        Dashboard
                                    </span>
                                </button>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
