import { Sender, Message } from '../interfaces/Message'
import { fetch,  Response } from 'fetch-h2'
class Corona_Bot {
    private corona:any;
    private country: string = "ID";
    private errorMessage:string = "Maaf bot tidak mengerti"
    private msg_credential:Sender = {
        firstName:"",
        chatId: 0,
        message: ""
    };
    readonly infoPencegahanPhoto:string = "https://backpanel.kemlu.go.id/PublishingImages/Pencegahan%20penularan%20covid%2019.jpeg";
    readonly infoPencegahanText:string = "Berikut merupakan infopencegahan dari virus covi19"
    readonly sumber:string = "Sumber kemenlu"
    readonly baseURL:string = "https://covid19.mathdro.id/api"
    readonly start:string = "Hi ini merupakan info virus corona (Covid19)"

    constructor(corona:any) {
        this.corona = corona
    }

    receiveMessage():void {
        this.corona.on('message', (message: Message) => {
            this.msg_credential = {
                firstName: message.chat.first_name,
                chatId: message.chat.id,
                message: message.text.toLowerCase()
            }
            this.indetifierMessage()
        })
    }

    private sendInfoPencegahan():void {
       this.corona.sendMessage(this.msg_credential.chatId, this.infoPencegahanText);
       this.corona.sendPhoto(this.msg_credential.chatId, this.infoPencegahanPhoto);
       this.corona.sendMessage(this.msg_credential.chatId, this.sumber);

    }


    private async kasusGlobal():Promise<void> {
        const response = await fetch( `${this.baseURL}` );
        const responseJSON = await response.json();
        console.log(responseJSON)
        this.corona.sendMessage(this.msg_credential.chatId,  `
        Kasus Dalam Sekala Global:
        Terkonfirmasi: ${responseJSON.confirmed.value}
        Sembuh : ${responseJSON.recovered.value}
        Kematian : ${responseJSON.deaths.value}
        Last Update: ${responseJSON.lastUpdate}
        `);
    }

    private startMessage():void {
        this.corona.sendMessage(this.msg_credential.chatId, this.start);
    }

    private sendErrorMessage():void{
        this.corona.sendMessage(this.msg_credential.chatId, this.errorMessage);
    }

    private async sendCaseByCountry():Promise<void>{
        const response = await fetch( `${this.baseURL}/countries/${this.country}` );
        const responseJSON = await response.json();
        console.log(responseJSON)

        if (typeof responseJSON.confirmed === undefined) {
            this.sendErrorMessage();
        }else{
            this.corona.sendMessage(this.msg_credential.chatId,  `
            Kasus Negara ${this.country}:
            Terkonfirmasi: ${responseJSON.confirmed.value}
            Sembuh : ${responseJSON.recovered.value}
            Kematian : ${responseJSON.deaths.value}
            Last Update: ${responseJSON.lastUpdate}
            `);
        }
    }

    private indetifierMessage():void{
        switch(this.msg_credential.message) {
            case "/start" :
                this.startMessage();
            break;
            case "/kasus-global":
                this.kasusGlobal();
            break;

            case '/info-pencegahan':
             this.sendInfoPencegahan()
            break;

            default:

            if (this.msg_credential.message.indexOf('/kasus-') > -1) {
                this.country = this.msg_credential.message.split("-", 2)[1]
                this.sendCaseByCountry();
            }else{
                this.sendErrorMessage();
            }

            break;
        }
    }
}

export default Corona_Bot;