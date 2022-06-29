import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../domain/Chat';
import { inputDto } from '../domain/input_chat.dto';

@Injectable()
export class ChatService {
    constructor(@InjectRepository(Chat) private readonly _chatRepository : Repository<Chat>,){}

    public saveMessage( input : inputDto ): Promise<Chat>{
        const data  = {
            "idGame" : input.idGame,
            "idSender" : input.idSender,
            "date" : new Date,
            "messageSended" : input.message_sended+""
        }
        return this._chatRepository.save(data);
    }

    async rescueMessega(input : inputDto ){
        const messages = [];
        const messageRecord = await this._chatRepository.find({ idSender : input.idSender , idGame : input.idGame });
        for (const c of messageRecord) {
            messages.push(c.messageSended);
          }
       // messages.push(input.message_sended)
        console.log(messages)
        return messages;
    }

    async rescueParner(input : inputDto){
        const parner = await this._chatRepository.findOne({ idGame : input.idGame });
        return parner.idSender;
    }

    async rescueAllMessage(id: number){
        const messages = [];
        const messageRecord = await this._chatRepository.find({ idGame : id });
        for (const c of messageRecord) {
            messages.push([c.idSender ,c.messageSended, c.date]);
          }
        return messages;
    }


}