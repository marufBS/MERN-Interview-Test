import React, { useState } from "react";
import './toolbar.css'; 
import { 
    FaMousePointer, 
    FaPencilAlt, 
    FaEraser,
    FaRegCircle

} from "react-icons/fa";
import { MdOutlineTextFields } from "react-icons/md";
import { LuRectangleHorizontal } from "react-icons/lu";
import { FaLinesLeaning } from "react-icons/fa6";
import { IoTriangleOutline } from "react-icons/io5";

const Toolbar = ({
            addCircle,
            addLine,
            addTextBox,
            addDraw,
            handleSelect,
            addRect,
            addErase,
            addTriangle
        }) => {
    const [selectedTool, setSelectedTool] = useState("select");

    const handleToolClick = (tool) => {
        setSelectedTool(tool);
        switch (tool) {
            case 'select':
                handleSelect()
                break;
            case 'pencil':
                addDraw()
                break;
            case 'eraser':
                addErase()
                break;
            case 'circle':
                addCircle()
                break;
            case 'rect':
                addRect()
                break;
            case 'edit':
                addTextBox()
                break;
            case 'line':
                addLine()
                break;
            case 'triangle':
                addTriangle()
                break;
            default:
                break;
        }
    };

    return (
        <div className="flex justify-center max-w-md">
            <div className="max-w-md border-red-800 border-3 bg-slate-200 rounded p-2">
                <button
                    className={`toolbar-button ${selectedTool === "select" ? "active" : ""}`}
                    onClick={() => handleToolClick("select")}
                >
                    <FaMousePointer />
                </button>
                
                <button
                    className={`toolbar-button ${selectedTool === "pencil" ? "active" : ""}`}
                    onClick={() => handleToolClick("pencil")}
                >
                    <FaPencilAlt />
                </button>
                <button
                    className={`toolbar-button ${selectedTool === "eraser" ? "active" : ""}`}
                    onClick={() => handleToolClick("eraser")}
                >
                    <FaEraser />
                </button>
                <button
                    className={`toolbar-button ${selectedTool === "edit" ? "active" : ""}`}
                    onClick={() => handleToolClick("edit")}
                >
                    <MdOutlineTextFields />
                </button>
                <button
                    className={`toolbar-button ${selectedTool === "circle" ? "active" : ""}`}
                    onClick={() => handleToolClick("circle")}
                >
                    <FaRegCircle />
                </button>
                <button
                    className={`toolbar-button ${selectedTool === "rect" ? "active" : ""}`}
                    onClick={() => handleToolClick("rect")}
                >
                    <LuRectangleHorizontal />
                </button>
                <button
                    className={`toolbar-button ${selectedTool === "line" ? "active" : ""}`}
                    onClick={() => handleToolClick("line")}
                >
                    <FaLinesLeaning />
                </button>
                <button
                    className={`toolbar-button ${selectedTool === "triangle" ? "active" : ""}`}
                    onClick={() => handleToolClick("triangle")}
                >
                    <IoTriangleOutline />
                </button>
            </div>
        </div>
    );
};

export default Toolbar;
