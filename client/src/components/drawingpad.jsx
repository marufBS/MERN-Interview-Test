import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Circle, Line, Rect, Textbox, PencilBrush } from 'fabric';
import Toolbar from './toolbar';
import Navbar from './navbar';
import { useDispatch, useSelector } from 'react-redux';
import { setDrawingCanvas, setTestingSwitch } from './drawingpadSlice';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Drawingpad = () => {
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState(null);
    const dispatch = useDispatch();
    const reduxCanvas = useSelector((state) => state.drawing.drawingCanvas);
    const reduxDrawingTitle = useSelector((state) => state.drawing.drawingTitle)
    const { id } = useParams()


    useEffect(() => {
        console.log('useEffect running')
        const canvasInstance = new Canvas(canvasRef.current, {
            width: window.innerWidth,
            height: window.innerHeight,
            allowTouchScrolling: true,
        });

        canvasInstance.clear()
        axios.get(`http://localhost:5000/api/drawing/${id}`)
            .then((res) => {

                if (!res.data.error) {

                    console.log("drawing data:", res.data);
                    const canvasJSON = res.data.drawing.canvas
                    canvasInstance.clear();
                    canvasInstance.loadFromJSON(canvasJSON)
                        .then((canvas) => {
                            canvas.requestRenderAll()
                        })
                        .catch((error) => console.error('Failed to restore canvas state:', error))

                }
            })
            .catch((error) => {
                console.error("Error loading drawing from database:", error);
            });




        if (reduxCanvas) {
            console.log("redux part working", reduxCanvas)
            canvasInstance.loadFromJSON(reduxCanvas, () => {
                canvasInstance.requestRenderAll();
            });
        } else {
            console.log("found error redux")

        }
        setCanvas(canvasInstance);




        const handleKeyDown = (event) => {
            if (event.key === 'Delete' || event.key === 'Backspace') {
                deleteSelectedObject();
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            canvasInstance.dispose();
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const getBase64Data = () => {
        if (canvas) {
            // Get the base64 data
            const dataURL = canvas.toDataURL({
                format: 'png', // Choose the image format (png, jpeg, etc.)
                quality: 0.8, // Quality for jpeg format (0 - 1)
            });

            console.log(dataURL); // Base64 data
            return dataURL;
        }
    };

    const saveCanvasToRedux = () => {
        console.log('updating...')
        if (canvas) {
            const canvasJSON = canvas.toJSON();
            dispatch(setDrawingCanvas(canvasJSON));
            axios.put(`http://localhost:5000/api/drawing/${id}`, {
                drawingTitle: reduxDrawingTitle,
                canvas: canvasJSON
            }).then((res) => {
                console.log(res)
            }).catch((err) => {
                console.log(err)
            })
        }
        dispatch(setTestingSwitch())

    };

    const deleteSelectedObject = async () => {
        if (canvas) {
            const activeObject = await canvas.getActiveObject();
            console.log(activeObject)
            if (activeObject) {
                console.log('deleting ')
                canvas.remove(activeObject);
                // canvas.requestRenderAll();
                saveCanvasToRedux();
            }
        }
    };

    if (canvas) canvas.on('mouse:up', saveCanvasToRedux)

    const handleSelect = () => {
        if (canvas) {
            canvas.isDrawingMode = false;
        }
    };

    const addRect = () => {
        if (canvas) {

            canvas.isDrawingMode = false
            const rect = new Rect({
                left: 20,
                top: 20,
                height: 200,
                width: 200,
                fill: 'red',
            });
            canvas.add(rect);
            saveCanvasToRedux();
        }

    };

    const addCircle = () => {
        if (canvas) {

            canvas.isDrawingMode = false
            const circle = new Circle({
                left: 50,
                top: 300,
                radius: 40,
                fill: 'orange',
            });
            canvas.add(circle);
            saveCanvasToRedux();
            // circle.on('object:moving', () => saveCanvasToRedux())
        }

    };

    const addLine = () => {
        if (canvas) {
            const line = new Line([50, 50, 200, 200], {
                stroke: 'green',
                strokeWidth: 5,
                selectable: true,
            });
            canvas.add(line);
            canvas.requestRenderAll();
            saveCanvasToRedux();
        }

    };

    const addDraw = () => {
        if (canvas) {
            const brush = new PencilBrush(canvas);
            brush.color = '#000000';
            brush.width = 5;
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush = brush;

            canvas.on('mouse:up', () => {
                // saveCanvasToRedux();
            });

        }
    };




    const addTextBox = () => {
        if (canvas) {

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
                console.log('mousedown event working')
                textbox.exitEditing();
            });
            canvas.add(textbox);
            // canvas.remove(canvas.getActiveObject())
            saveCanvasToRedux();
        }
    };

    const startErase = () => {
        if (canvas) {
            const eraser = new PencilBrush(canvas)
            eraser.color = '#FFFFFF';
            eraser.width = 20;
            canvas.isDrawingMode = true
            canvas.freeDrawingBrush = eraser
        }
    }



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
                        startErase={startErase}
                    />
                </div>
            </div>
        </div>
    );
};

export default Drawingpad;
