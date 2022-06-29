
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ChatService } from '../service/chat.service';
import { inputDto } from '../domain/input_chat.dto';

@Controller('chat')
export class ChatController {

    constructor(private readonly _chatService: ChatService) { }

    @MessagePattern('rescureAllMessageGet')
    async rescureAllMessageGet(idGame: number) {
        return await this._chatService.rescueAllMessage(idGame);
    }


    @MessagePattern('saveMessage')
    async saveMessage({ idUser, idGame, ipd }) {
        const input: inputDto = {
            "idGame": idGame,
            "message_sended": ipd.message,
            "idSender": idUser,
        }
        return await this._chatService.saveMessage(input);
    }
}
