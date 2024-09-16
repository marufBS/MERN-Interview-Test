import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Circle, Line, Rect, Textbox, PencilBrush } from 'fabric';
import Toolbar from './toolbar';
import Navbar from './navbar';
import { useDispatch, useSelector } from 'react-redux';
import { setCanvasBase64, setDrawingCanvas, setDrawingThumbnail, setIsUpdate, setTestingSwitch } from './drawingpadSlice';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { IoDuplicate } from 'react-icons/io5';

//loaging the .env file

const Drawingpad = () => {
    const IMGBB_API_KEY = '2b6dcaf41fa4832f8d0cfe58769998fb'
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState(null);
    const dispatch = useDispatch();
    const reduxCanvas = useSelector((state) => state.drawing.drawingCanvas);
    const reduxDrawingTitle = useSelector((state) => state.drawing.drawingTitle)
    const drawingThumbnail = useSelector((state) => state.drawing.drawingThumbnail)
    const isUpdate = useSelector((state) => state.drawing.isUpdate)
    const { id } = useParams()


    useEffect(() => {
        const canvasInstance = new Canvas(canvasRef.current, {
            width: window.innerWidth,
            height: window.innerHeight,
            allowTouchScrolling: true,
        });

        canvasInstance.clear();

        axios.get(`http://localhost:5000/api/drawing/${id}`)
            .then((res) => {

                if (!res.data.error) {
                    console.log("drawing data:", res.data);
                    const canvasJSON = res.data.drawing.canvas
                    if (res.data.drawing.canvas) {
                        canvasInstance.loadFromJSON(canvasJSON)
                            .then((canvas) => canvas.requestRenderAll())
                            .catch((error) => console.error('Failed to restore canvas state:', error))
                    }
                }
            })
            .catch((error) => {
                console.error("Error loading drawing from database:", error);
            });


        // Load canvas from Redux if available
        if (reduxCanvas) {
            console.log("redux part working")
            canvasInstance.loadFromJSON(reduxCanvas, () => {
                canvasInstance.requestRenderAll()
            });
        } else {
            console.log("found error redux")
        }
        // Set canvas instance to state
        setCanvas(canvasInstance);

        canvasInstance.on('object:modified', saveCanvasToRedux)
        setCanvasBase64(canvasInstance.toDataURL({
            format: 'png', // Can be 'jpeg' or 'jpg' if you want a different format
            quality: 0.8, // Quality (0 to 1), applicable for 'jpeg' format
        }).split('base64,')[1])
        return () => {
            // canvasInstance.off('object:modified',saveCanvasToRedux) 
            canvasInstance.dispose();
        };
    }, []);

    useEffect(() => {
        if (isUpdate) {
            // saveCanvasToRedux()
        }
    }, [isUpdate])

    const saveCanvasToRedux = () => {
        console.log('saving without')
        if (canvas) {
            console.log('saving canvas')
            const canvasJSON = canvas.toJSON();
            dispatch(setDrawingCanvas(canvasJSON));
        }
    };

    // Add various objects to the canvas
    const addRect = () => {
        canvas.isDrawingMode = false
        const rect = new Rect({
            left: 20,
            top: 20,
            height: 200,
            width: 200,
            fill: 'red',
        });
        canvas.add(rect);
        saveCanvasToRedux(); // Save canvas after adding object
    };

    const addCircle = () => {
        canvas.isDrawingMode = false
        const circle = new Circle({
            left: 50,
            top: 300,
            radius: 40,
            fill: 'orange',
        });
        canvas.add(circle);
        circle.on('modified',()=>saveCanvasToRedux())
        saveCanvasToRedux(); // Save canvas after adding object
    };

    const addLine = () => {
        canvas.isDrawingMode = false
        const line = new Line([50, 50, 200, 200], {
            stroke: 'green',
            strokeWidth: 5,
        });
        canvas.add(line);
        saveCanvasToRedux(); // Save canvas after adding object
    };

    const addDraw = () => {
        if (canvas) {
            const brush = new PencilBrush(canvas);
            brush.color = '#000000';
            brush.width = 5;
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush = brush;

            canvas.on('mouse:up', () => {
                saveCanvasToRedux(); // Save canvas after drawing
            });
        }
    };

    const addErase = () => {
        if (canvas) {
            const erase = new PencilBrush(canvas)
            erase.color = '#FFFFFF';
            erase.width = 25;
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush = erase;

            canvas.on('mouse:up', () => {
                saveCanvasToRedux(); // Save canvas after drawing
            });
        }
    }

    const handleSelect = () => {
        canvas.isDrawingMode = false;
    };


    const addTextBox = () => {
        canvas.isDrawingMode = false;
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

        canvas.add(textbox);
        saveCanvasToRedux(); // Save canvas after adding textbox
    };

    return (
        <div className='flex h-dvh flex-col'>
            <Navbar canvasInstance={canvas} />
            <div className='flex-1 overflow-hidden'>
                <canvas ref={canvasRef}></canvas>
            </div>
            <div className='flex items-end'>
                <div className='absolute w-full h-32 flex justify-center items-center'>
                    <Toolbar
                        // setIsDrawingMode={setIsDrawingMode} 
                        handleSelect={handleSelect}
                        addDraw={addDraw}
                        addTextBox={addTextBox}
                        addCircle={addCircle}
                        addLine={addLine}
                        addRect={addRect}
                        addErase={addErase}
                    />
                </div>
            </div>
        </div>
    );
};

export default Drawingpad;
