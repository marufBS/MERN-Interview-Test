import mongoose from "mongoose";
const drawingSchema = new mongoose.Schema({
    drawingTitle: { type: String, required: true },
    canvasDimension: {
        width: { type: Number, required: false },
        height: { type: Number, required: false }
    },
    canvas: {
        type:Object,
        requiered:false,
        default:null
    },
    createdAt: { type: Date, default: Date.now, },
    updatedAt: { type: Date, default: Date.now, },
})

const drawingModel = mongoose.model('Drawing', drawingSchema)
export default drawingModel