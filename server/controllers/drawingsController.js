import drawingModel from "../models/drawingsModel.js"

export const testApi = async (req, res) => {
    res.send("Hello backend of whiteboard")
}
//get=> /api/drawing
export const createDrawing = async (req, res) => {

    try {
        const newDrawing = drawingModel({
            drawingTitle: 'Untitled Drawing'
        })
        const savedDrawing = await newDrawing.save();
        res.status(200).send({ error: false, drawing: savedDrawing })
    } catch (error) {
        res.status(500).send({ error: false, message: 'failed to save drawing' })
    }
}

//get=> /api/drawing/:id
export const getDrawingById = async (req, res) => {
    try {
        const id = req.params.id
        const snapshot = await drawingModel.findOne({ _id: id })
        res.json({ error: false, drawing: snapshot })
    } catch (error) {
        res.json({ error: true, message: 'drawing not found' })
    }
}

//get=> /api/drawings
export const getDrawings = async (req, res) => {
    const snapshot = await drawingModel.find();
    res.json({ error: false, drawings: snapshot })
}

// put=> /api/drawings/:id
export const updateDrawing = async (req, res) => {
    try {
        const { id } = req.params
        const { drawingTitle, canvas, canvasThumbnail } = req.body
        // console.log(canvasThumbnail)
        const updateDrawing = await drawingModel.findOneAndUpdate({ _id: id }, { id, canvas, drawingTitle, canvasThumbnail }, { new: true, upsert: true })
        res.status(200).send({ error: false, updateDrawing })

    } catch (error) {
        res.status(500).send({ error: true, message: 'drawing not found' })
    }
}

export const deleteDrawing = async (req, res) => {
    try {

        const { id } = req.params
        console.log(id)
        const deletedDrawing = await drawingModel.deleteOne({ _id: id })
        res.status(200).send({ error: false, message: 'drawing deleted successfully', deletedDrawing: deletedDrawing })
    } catch (error) {
        res.status(500).send({ error: true, message: 'drawing not found' + error })
    }
}

// post=> /api/imgbbThumbnail
// export const saveThumbnail = async (req, res) => {

//     try {
//         console.log('got route')
//         const { base64 } = req.body
//         const response = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, base64, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${process.env.IMGBB_API_KEY}`
//             }
//         });
//         res.json(response.data);
//     } catch (error) {
//         res.status(error.response?.status || 500).json(error.message);
//     }
// }