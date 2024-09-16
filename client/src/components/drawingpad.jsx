import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Circle, Line, Rect, Textbox, PencilBrush, Triangle } from 'fabric';
import Toolbar from './toolbar';
import Navbar from './navbar';
import { useDispatch, useSelector } from 'react-redux';
import { setDrawingCanvas } from './drawingpadSlice';
import axios from 'axios';
import { useParams } from 'react-router-dom';
const Drawingpad = () => {
    const Vercel_URL = "https://mern-interview-test-server-kappa.vercel.app"
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState(null);
    const dispatch = useDispatch();
    const reduxCanvas = useSelector((state) => state.drawing.drawingCanvas);
    const { id } = useParams()


    useEffect(() => {
        const canvasInstance = new Canvas(canvasRef.current, {
            width: window.innerWidth,
            height: window.innerHeight,
            allowTouchScrolling: true,
        });

        // canvasInstance.clear();

        const loadCanvas = async () => {
            return new Promise((resolve) => {
                axios.get(`${Vercel_URL}/api/drawing/${id}`)
                    .then((res) => {
                        canvasInstance.clear();
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

                resolve()
            }).then(() => {
                setCanvas(canvasInstance);

            })
        }
        loadCanvas()



        // Load canvas from Redux if available
        if (reduxCanvas) {
            canvasInstance.clear();
            console.log("redux part working")
            canvasInstance.loadFromJSON(reduxCanvas, () => {
                canvasInstance.requestRenderAll()
            });
        } else {
            console.log("found error redux")
        }
        // Set canvas instance to state


        canvasInstance.on('object:modified', saveCanvasToRedux)
        canvasInstance.on('object:added', saveCanvasToRedux)
        return () => {
            canvasInstance.off('object:modified', saveCanvasToRedux)
            canvasInstance.off('object:added', saveCanvasToRedux)
            canvasInstance.dispose();
        };
    }, []);


    const saveCanvasToRedux = () => {
        console.log('saving without')
        if (canvas) {
            console.log('saving canvas')
            const canvasJSON = canvas.toJSON();
            dispatch(setDrawingCanvas(canvasJSON));
        }
    };

    //generating random color
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const getRandomNumber = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Add objects to the canvas
    const addRect = () => {
        canvas.isDrawingMode = false
        const rect = new Rect({
            left: getRandomNumber(0, window.innerHeight / 2),
            top: getRandomNumber(0, window.innerHeight / 2),
            height: 200,
            width: 200,
            fill: getRandomColor(),
        });
        canvas.add(rect);
        rect.on('modified', () => saveCanvasToRedux())
        saveCanvasToRedux();
    };

    const addCircle = () => {
        if (canvas) {

            canvas.isDrawingMode = false
            const circle = new Circle({
                left: getRandomNumber(0, window.innerHeight / 2),
                top: getRandomNumber(0, window.innerHeight / 2),
                radius: getRandomNumber(0, window.innerHeight / 2),
                fill: getRandomColor(),
            });
            canvas.add(circle);
            circle.on('modified', () => saveCanvasToRedux())
            saveCanvasToRedux();
        }
    };
    const addTriangle = () => {
        if (canvas) {

            canvas.isDrawingMode = false
            const triangle = new Triangle({
                left: 50,
                top: 300,
                angle: 30,
                fill: getRandomColor(),
            });
            canvas.add(triangle);
            triangle.on('modified', () => saveCanvasToRedux())
            saveCanvasToRedux();
        }
    };

    const addLine = () => {
        canvas.isDrawingMode = false
        const line = new Line([50, 50, 200, 200], {
            stroke: 'green',
            strokeWidth: 5,
            selectable: true, // Allow selection and moving

        });
        canvas.freeDrawingMode = true
        canvas.freeDrawingBrush = line
        canvas.add(line);
        saveCanvasToRedux();
    };

    const addDraw = () => {
        if (canvas) {
            const brush = new PencilBrush(canvas);
            brush.color = '#000000';
            brush.width = 5;
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush = brush;

            canvas.on('mouse:up', () => {
                saveCanvasToRedux();
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
                saveCanvasToRedux();
            });
        }
    }

    const handleSelect = () => {
        if (canvas) canvas.isDrawingMode = false;
    };




    const addTextBox = () => {
        canvas.isDrawingMode = false;
        const textbox = new Textbox('', {
            left: 400,
            top: 300,
            fill: 'black',
            fontSize: 50,
            width: 300,
            hasControls: true,
        });

        textbox.enterEditing();

        textbox.on('deselected', () => {
            textbox.exitEditing();
            saveCanvasToRedux();
        });

        canvas.add(textbox);
        saveCanvasToRedux();
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
                        handleSelect={handleSelect}
                        addDraw={addDraw}
                        addTextBox={addTextBox}
                        addCircle={addCircle}
                        addLine={addLine}
                        addRect={addRect}
                        addErase={addErase}
                        addTriangle={addTriangle}
                    />
                </div>
            </div>
        </div>
    );
};

export default Drawingpad;
