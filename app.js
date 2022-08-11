
// ? This file is for setting my express app before I run it.
// ? With everything it needs. (Create and setup my express app)

import express from 'express'
import router from './views/router.js'
import cors from 'cors'

// ? My own middleware
import logger from './middleware/logger.js'
import errorHandler from './middleware/errorHandler.js'

const app = express()


app.use(express.json())
app.use(cors())
// ? Using my own logging middleware.
app.use(logger)
// ! Router is a special piece of middleware.
app.use('/api', router)
// ! Error handling is also special.
app.use(errorHandler)


export default app