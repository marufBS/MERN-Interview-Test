import express from "express";
import { createDrawing, getDrawingById, getDrawings, testApi, updateDrawing} from "../controllers/drawingsController.js";

const router = express.Router()


router.get('/',testApi)
router.post('/api/imgbbthumbnail')
router.post('/api/drawing',createDrawing)
router.get('/api/drawing/:id',getDrawingById)
router.get('/api/drawings',getDrawings)
router.put('/api/drawing/:id',updateDrawing)

export default router