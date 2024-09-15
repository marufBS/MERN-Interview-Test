import {configureStore} from '@reduxjs/toolkit'
// import drawingpad2Reducer from '../components/drawingpad2Slice'

const store = configureStore({
    reducer:{
        // drawing:drawingpad2Reducer
    }
})

export default store