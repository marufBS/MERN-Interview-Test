import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Circle, Line, Rect, Textbox, PencilBrush } from 'fabric';
import Toolbar from './toolbar';
import Navbar from './navbar';
import { useDispatch, useSelector } from 'react-redux';
import { setDrawingCanvas, setDrawingThumbnail, setTestingSwitch } from './drawingpadSlice';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Drawing = () => {
    const canvasRef = useRef(null);
    const fabricCanvas = useRef(null); // Use useRef for the Fabric canvas instance
    const [isCanvasReady, setIsCanvasReady] = useState(false);
    const IMGBB_API_KEY = '2b6dcaf41fa4832f8d0cfe58769998fb';
    const dispatch = useDispatch();
    const reduxCanvas = useSelector((state) => state.drawing.drawingCanvas);
    const reduxDrawingTitle = useSelector((state) => state.drawing.drawingTitle);
    const drawingThumbnail = useSelector((state) => state.drawing.drawingThumbnail);
    const { id } = useParams();

    // Initialize the canvas
    useEffect(() => {
        const canvasInstance = new Canvas(canvasRef.current, {
            width: window.innerWidth,
            height: window.innerHeight,
            allowTouchScrolling: true,
        });

        fabricCanvas.current = canvasInstance; // Assign to the useRef

        // Save canvas on mouse up
        const handleMouseUp = () => {
            saveCanvasToRedux();
        };

        // Save canvas on object modification
        const handleObjectModified = () => {
            saveCanvasToRedux();
        };

        // Save canvas on object addition
        const handleObjectAdded = () => {
            saveCanvasToRedux();
        };

        // Attach event listeners
        canvasInstance.on('mouse:up', handleMouseUp);
        canvasInstance.on('object:modified', handleObjectModified);
        canvasInstance.on('object:added', handleObjectAdded);

        setIsCanvasReady(true); // Mark the canvas as ready

        return () => {
            // Clean up event listeners
            canvasInstance.off('mouse:up', handleMouseUp);
            canvasInstance.off('object:modified', handleObjectModified);
            canvasInstance.off('object:added', handleObjectAdded);
            canvasInstance.dispose();
        };
    }, []);

    // Load the canvas data from the server and Redux
    useEffect(() => {
        if (!fabricCanvas.current || !isCanvasReady) return; // Exit if canvas is not initialized

        // Fetch drawing data from the server
        axios.get(`http://localhost:5000/api/drawing/${id}`)
            .then((res) => {
                if (!res.data.error) {
                    const canvasJSON = res.data.drawing.canvas;
                    dispatch(setDrawingCanvas(canvasJSON));
                    fabricCanvas.current.loadFromJSON(canvasJSON)
                        .then(() => {
                            fabricCanvas.current.requestRenderAll();
                        })
                        .catch((error) => console.error('Failed to restore canvas state:', error));
                }
            })
            .catch((error) => {
                console.error("Error loading drawing from database:", error);
            });

        // Load canvas data from Redux
        if (reduxCanvas) {
            fabricCanvas.current.clear();
            fabricCanvas.current.loadFromJSON(reduxCanvas, () => {
                fabricCanvas.current.requestRenderAll();
            });
        } else {
            console.log("Canvas data not found in Redux");
        }
    }, [isCanvasReady, dispatch, id, reduxCanvas]);

    // Save canvas state to the server
    const updateDrawing = () => {
        axios.put(`http://localhost:5000/api/drawing/${id}`, {
            drawingTitle: reduxDrawingTitle,
            canvas: reduxCanvas,
            canvasThumbnail: drawingThumbnail
        })
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });
    };

    // Save canvas state to Redux and update the server
    const saveCanvasToRedux = () => {
        if (fabricCanvas.current) {
            const canvasJSON = fabricCanvas.current.toJSON();
            dispatch(setDrawingCanvas(canvasJSON));
            updateDrawing();
            dispatch(setTestingSwitch());
        }
    };

    // Delete the selected object from the canvas
    const deleteSelectedObject = () => {
        if (fabricCanvas.current) {
            const activeObject = fabricCanvas.current.getActiveObject();
            if (activeObject) {
                fabricCanvas.current.remove(activeObject);
                saveCanvasToRedux();
            }
        }
    };

    // Set canvas to selection mode
    const handleSelect = () => {
        if (fabricCanvas.current) {
            fabricCanvas.current.isDrawingMode = false;
        }
    };

    // Add a rectangle to the canvas
    const addRect = () => {
        if (fabricCanvas.current) {
            fabricCanvas.current.isDrawingMode = false;
            const rect = new Rect({
                left: 20,
                top: 20,
                height: 200,
                width: 200,
                fill: 'red',
            });
            fabricCanvas.current.add(rect);
        }
    };

    // Add a circle to the canvas
    const addCircle = () => {
        if (fabricCanvas.current) {
            fabricCanvas.current.isDrawingMode = false;
            const circle = new Circle({
                left: 50,
                top: 300,
                radius: 40,
                fill: 'orange',
            });
            fabricCanvas.current.add(circle);
        }
    };

    // Add a line to the canvas
    const addLine = () => {
        if (fabricCanvas.current) {
            const line = new Line([50, 50, 200, 200], {
                stroke: 'green',
                strokeWidth: 5,
                selectable: true,
            });
            fabricCanvas.current.add(line);
        }
    };

    // Enable drawing mode with a pencil brush
    const addDraw = () => {
        if (fabricCanvas.current) {
            const brush = new PencilBrush(fabricCanvas.current);
            brush.color = '#000000';
            brush.width = 5;
            fabricCanvas.current.isDrawingMode = true;
            fabricCanvas.current.freeDrawingBrush = brush;
        }
    };

    // Start erasing on the canvas
    const startErase = () => {
        if (fabricCanvas.current) {
            const eraser = new PencilBrush(fabricCanvas.current);
            eraser.color = '#FFFFFF';
            eraser.width = 20;
            fabricCanvas.current.isDrawingMode = true;
            fabricCanvas.current.freeDrawingBrush = eraser;
        }
    };

    // Add a text box to the canvas
    const addTextBox = () => {
        if (fabricCanvas.current) {
            fabricCanvas.current.isDrawingMode = false;
            const textbox = new Textbox('', {
                left: 400,
                top: 300,
                fill: 'orange',
                fontSize: 50,
                width: 300,
                hasControls: true,
            });
            textbox.enterEditing();
            textbox.on('mousedown', () => {
                textbox.exitEditing();
            });
            fabricCanvas.current.add(textbox);
        }
    };

    return (
        <div className='flex h-dvh flex-col'>
            <Navbar canvasInstance={fabricCanvas.current} />
            <div className='flex-1 overflow-hidden'>
                <canvas ref={canvasRef}></canvas>
            </div>
            <div className='flex items-end'>
                <div className='absolute w-full h-32 flex justify-center items-center'>
                    <Toolbar
                        handleSelect={handleSelect}
                        addDraw={addDraw}
                        addTextBox={addTextBox}
                        addCircle={addCircle}
                        addLine={addLine}
                        addRect={addRect}
                        startErase={startErase}
                    />
                </div>
            </div>
        </div>
    );
};

export default Drawing;
