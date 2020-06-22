import * as dotenv from 'dotenv'
dotenv.config()
import Corona_Bot from './services/corona_bot'
import token from './config/telegram.config'
const corona = new Corona_Bot(token)

corona.receiveMessage()

console.log("Running Server")