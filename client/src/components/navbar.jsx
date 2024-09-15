// Navbar.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link} from 'react-router-dom';
import { setDrawingTitle } from './drawingpadSlice';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isInput, setIsInput] = useState(false)
    const dispatch = useDispatch()
    const reduxDrawingTitle = useSelector((state)=>state.drawing.drawingTitle)
    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };


    return (
        <nav className="bg-white border-gray-200 shadow">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4">
                <input 
                    className='focus:outline-none border-2 border-white hover:border-black rounded-lg text-center text-xl py-1' 
                    onChange={(e) => dispatch(setDrawingTitle(e.target.value))}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') setIsInput(false);
                    }}
                    defaultValue={reduxDrawingTitle?reduxDrawingTitle:'Untitled Drawing'} 
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
                        <li>
                            <Link className='text-emerald-400 hover:text-emerald-500 hover:shadow-lg shadow rounded py-2 px-5 transition-all duration-150 ease-in-out' to="/dashboard">Dashboard</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
