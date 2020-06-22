interface Chat {
    id: number,
    first_name: string
}

export interface Sender {
    firstName: string,
    chatId: number,
    message: string
}

export interface Message {
    message_id: string,
    from: object,
    chat: Chat,
    text: string
}