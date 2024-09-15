import {configureStore} from '@reduxjs/toolkit'
import drawingpad2Reducer from '../components/drawingpadSlice'

const store = configureStore({
    reducer:{
        drawing:drawingpad2Reducer
    }
})

export default store