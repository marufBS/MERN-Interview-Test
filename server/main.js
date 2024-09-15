import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import path from 'path'
import { fileURLToPath } from 'url';
import { connectDB } from './db.js'
import drawingsRoute from './routes/drawingsRoute.js'

const app = express()
const port = process.env.PORT || 5000
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
dotenv.config()

//mongodb connection
connectDB()

//middlewares
app.use(bodyParser.json())
app.use(cors({origin:"*"}))
app.use(drawingsRoute)
app.use('/', express.static(path.join(__dirname, '../client/build')))


app.listen(port,()=>{
    console.log(`server running at port: ${port}`)
})