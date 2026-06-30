import express from "express"
import isAuth from '../middleware/isAuth.js'
import {pdfDownload} from '../controllers/pdfController.js'

const pdfRouter = express.Router()

pdfRouter.post("/download", isAuth, pdfDownload)

export default pdfRouter