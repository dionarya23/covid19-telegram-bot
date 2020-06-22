import TelegramBot from 'node-telegram-bot-api'

const coronaBot = new TelegramBot(<string>process.env.TOKEN, {polling:true})

export default coronaBot