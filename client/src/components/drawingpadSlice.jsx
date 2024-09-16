import { createSlice } from "@reduxjs/toolkit";

const drawingSlice = createSlice({
    name: 'drawing',
    initialState: {
        drawingObjects: [],
        drawingCanvas: null,
        drawingTitle: "",
        isUpdate: false,
        drawingThumbnail: "",
        canvasBase64:""
    },
    reducers: {
        setDrawingObjects: ((state, action) => {
            state.drawingObjects = [...state.drawingObjects, action.payload]
        }),
        setDrawingCanvas: ((state, action) => {
            state.drawingCanvas = action.payload
        }),
        setDrawingTitle: ((state, action) => {
            state.drawingTitle = action.payload
        }),
        setIsUpdate: ((state, action) => {
            state.isUpdate = action.payload
        }),
        setDrawingThumbnail: ((state, action) => {
            state.drawingThumbnail = action.payload
        }),
        setCanvasBase64:((state,action)=>{
            state.canvasBase64 = action.payload
        })
    }
})

export const { setDrawingObjects, setDrawingCanvas, setDrawingTitle, setIsUpdate, setDrawingThumbnail,setCanvasBase64 } = drawingSlice.actions
export default drawingSlice.reducer