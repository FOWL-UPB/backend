import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/auth.guard';
import { inputPostDto } from '../domain/inputPost_chat.dto';
import { ChatService } from '../service/chat.service';

@Controller('chat')
export class ChatController {
    constructor(private readonly _chatService: ChatService) { }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async rescureAllMessageGet(@Param('id') idGame: number): Promise<any> {
        return await this._chatService.rescureAllMessageGet(idGame);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async saveMessage(@Request() request, @Param('id') idGame, @Body() ipd: inputPostDto): Promise<any> {
        return await this._chatService.saveMessage({ idUser: request.user.idUser, idGame, ipd });
    }
}
