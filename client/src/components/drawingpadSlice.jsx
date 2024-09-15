import { createSlice } from "@reduxjs/toolkit";

const drawingSlice = createSlice({
    name:'drawing',
    initialState:{
        drawingObjects:[],
        drawingCanvas:null,
        drawingTitle:"",
        testingSwitch:false,
    },
    reducers:{
        setDrawingObjects:((state,action)=>{
            state.drawingObjects = [...state.drawingObjects,action.payload]
        }),
        setDrawingCanvas:((state,action)=>{
            state.drawingCanvas = action.payload
        }),
        setDrawingTitle:((state,action)=>{
            state.drawingTitle = action.payload
        }),
        setTestingSwitch:((state)=>{
            state.testingSwitch=!state.testingSwitch
        })
    }
})

export const {setDrawingObjects, setDrawingCanvas,setDrawingTitle,setTestingSwitch} = drawingSlice.actions
export default drawingSlice.reducer