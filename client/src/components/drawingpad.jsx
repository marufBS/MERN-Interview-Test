import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Circle, Line, Rect, Textbox, PencilBrush } from 'fabric';
import Toolbar from './toolbar';
import Navbar from './navbar';
import { useDispatch, useSelector } from 'react-redux';
import { setDrawingCanvas, setDrawingThumbnail, setTestingSwitch } from './drawingpadSlice';
import axios from 'axios';
import { useParams } from 'react-router-dom';

//loaging the .env file

const Drawingpad = () => {
    const IMGBB_API_KEY = '2b6dcaf41fa4832f8d0cfe58769998fb'
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState(null);
    const dispatch = useDispatch();
    const reduxCanvas = useSelector((state) => state.drawing.drawingCanvas);
    const reduxDrawingTitle = useSelector((state) => state.drawing.drawingTitle)
    const drawingThumbnail = useSelector((state) => state.drawing.drawingThumbnail)
    const { id } = useParams()


    useEffect(() => {
        //Initializing the canvas
        const canvasInstance = new Canvas(canvasRef.current, {
            width: window.innerWidth,
            height: window.innerHeight,
            allowTouchScrolling: true,
        });

        //Dynamic Render by ID
        if (id) {
            axios.get(`http://localhost:5000/api/drawing/${id}`)
                .then((res) => {
                    if (!res.data.error) {
                        const canvasJSON = res.data.drawing.canvas
                        dispatch(setDrawingCanvas(canvasJSON));
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
        }




        if (reduxCanvas) {
            canvasInstance.clear();
            canvasInstance.loadFromJSON(reduxCanvas, () => {
                canvasInstance.requestRenderAll();
            });
        } else {
            console.log("canvas data not found on redux")

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
    }, [id]);

    const getBase64Data = async () => {
        if (canvas) {
            return new Promise((resolve) => {


                // Get the base64 data
                const dataURL = canvas.toDataURL({
                    format: 'png', // Choose the image format (png, jpeg, etc.)
                    quality: 0.1, // Quality for jpeg format (0 - 1)
                });
                resolve(dataURL)
            })
        }
    };


    const uploadImageToImgbb = async (base64Image) => {
        try {
            // Construct the form data
            // const formData = new FormData();
            // formData.append('image', base64Image);
            // console.log('====>',formData)

            // Send the POST request to imgbb
            // const response = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            //     image:base64Image,
            //     key:IMGBB_API_KEY
            // });
            // console.log(response)

            // // Extract the URL from the response
            // const imageUrl = response.data.data.url;

            // return imageUrl;

            axios.post('http://localhost:5000/api/imgbbthumbnail', {
                image: base64Image
            })
                .then((res) => {
                    console.log(res)
                })
        } catch (error) {
            console.error('Error uploading image to imgbb:', error);
            throw error;
        }
    };

    //
    const updateDrawing = () => {
        axios.put(`http://localhost:5000/api/drawing/${id}`, {
            drawingTitle: reduxDrawingTitle,
            canvas: reduxCanvas,
            canvasThumbnail: drawingThumbnail

        }).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
    }


    const saveCanvasToRedux = () => {
        if (canvas) {
            const canvasJSON = canvas.toJSON();
            dispatch(setDrawingCanvas(canvasJSON));
            // updating canvas on sevaral event
            updateDrawing()
            dispatch(setTestingSwitch())
        }

    };

    const deleteSelectedObject = async () => {
        if (canvas) {
            const activeObject = await canvas.getActiveObject();
            if (activeObject) {
                canvas.remove(activeObject);
                // canvas.requestRenderAll();
                saveCanvasToRedux();
            }
        }
    };

    if (canvas) canvas.on('mouse:up', saveCanvasToRedux)


    //Select Button Functionality
    const handleSelect = async () => {
        if (canvas) {
            canvas.isDrawingMode = false;
            // dispatch(setDrawingThumbnail(getBase64Data().then((res)=>console.log(res))))
            // await getBase64Data().then((res) => dispatch(setDrawingThumbnail(res)))
            // uploadImageToImgbb().then(async (res) => console.log(res))
            // await getBase64Data().then(async (res) => {
            //     await uploadImageToImgbb(res)
            //         .then((link) => console.log(link))
            // })
        }

    };

    //Rectangle Button Functionality
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

    //Circle Button Functionality
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

    //Line Button Functionality
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

    //Draw Functionality
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

    //Erase Functionality
    const startErase = () => {
        if (canvas) {
            const eraser = new PencilBrush(canvas)
            eraser.color = '#FFFFFF';
            eraser.width = 20;
            canvas.isDrawingMode = true
            canvas.freeDrawingBrush = eraser
        }
    }


    //Textbox functionality
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
                textbox.exitEditing();
            });
            canvas.add(textbox);
            // canvas.remove(canvas.getActiveObject())
            saveCanvasToRedux();
        }
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
                        startErase={startErase}
                    />
                </div>
            </div>
        </div>
    );
};

export default Drawingpad;
