import React, { useState } from "react";
import { FaMousePointer, FaHandPaper, FaPencilAlt, FaEraser, FaArrowUp, FaTextHeight, FaEdit, FaImage, FaSquare } from "react-icons/fa";
import { CiText } from "react-icons/ci";
import { RiText } from "react-icons/ri";
import { MdOutlineTextFields } from "react-icons/md";
import { BiUndo, BiRedo } from "react-icons/bi";
import { LuRectangleHorizontal } from "react-icons/lu";
import { FaRegCircle } from "react-icons/fa";
import { IoTriangleOutline } from "react-icons/io5";
import { FaLinesLeaning } from "react-icons/fa6";
import './toolbar.css'; // Import a CSS file for the styles

const Toolbar = ({
            setIsDrawingMode,
            isDrawingMode,
            addCircle,
            addLine,
            addTextBox,
            addDraw,
            handleSelect,
            addRect,
            startErase
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
                startErase()
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
            default:
                break;
        }
    };

    return (
        <div className="flex justify-center max-w-sm">
            <div className="max-w-md border-red-800 border-3 bg-slate-200 rounded p-2">
                <button
                    className={`toolbar-button ${selectedTool === "select" ? "active" : ""}`}
                    onClick={() => handleToolClick("select")}
                >
                    <FaMousePointer />
                </button>
                <button
                    className={`toolbar-button ${selectedTool === "hand" ? "active" : ""}`}
                    onClick={() => handleToolClick("hand")}
                >
                    <FaHandPaper />
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
                    className={`toolbar-button ${selectedTool === "arrow" ? "active" : ""}`}
                    onClick={() => handleToolClick("arrow")}
                >
                    <FaArrowUp />
                </button>
                <button
                    className={`toolbar-button ${selectedTool === "edit" ? "active" : ""}`}
                    onClick={() => handleToolClick("edit")}
                >
                    <MdOutlineTextFields />
                </button>
                {/* <button
                    className={`toolbar-button ${selectedTool === "undo" ? "active" : ""}`}
                    onClick={() => handleToolClick("undo")}
                >
                    <BiUndo />
                </button>
                <button
                    className={`toolbar-button ${selectedTool === "redo" ? "active" : ""}`}
                    onClick={() => handleToolClick("redo")}
                >
                    <BiRedo />
                </button> */}
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
            </div>
        </div>
    );
};

export default Toolbar;
