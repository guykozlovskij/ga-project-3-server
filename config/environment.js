import dotenv from 'dotenv'
dotenv.config()

export const env = process.env.NODE_ENV || 'dev'
const isProd = env === 'production'
export const dbURI = isProd ?
  process.env.DB_URI : 'mongodb://localhost/musicdb'
export const port = process.env.PORT || 4000
//JWT Secret Token
export const secret = process.env.SECRET || 'bowlrainbowsheddrivegear'