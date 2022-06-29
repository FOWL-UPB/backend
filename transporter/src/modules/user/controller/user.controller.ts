import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/modules/auth/auth.guard';
import { UserModel } from '../domain/userModel';
import { UserService } from '../service/user.service';
import { v4 as uuidv4 } from 'uuid';

export const storage = {
    storage: diskStorage({
        destination: './uploads/profileImages',
        filename: (req, file, cb) => {
            const filename: string = uuidv4() + file.originalname;

            cb(null, `${filename}`);
        }
    })
}

@Controller('user')
export class UserController {
    constructor(private readonly _userService: UserService) { }

    @Post('signUp')
    async signUp(@Body() { userName, email, password }): Promise<{ token: string }> {
        const response = await this._userService.signUp({ userName, email, password });
        if (response.isOk) {
            return response.data;
        } else {
            throw new HttpException(response.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('signIn')
    async signIn(@Body() { email, password }): Promise<{ token: string }> {
        const response = await this._userService.signIn({ email, password });
        if (response.isOk) {
            return response.data;
        } else {
            throw new HttpException(response.message, HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    async infoUser(@Param('id') id: string): Promise<UserModel> {
        const response = await this._userService.infoUser(id);
        if (response.isOk) {
            return response.data;
        } else {
            throw new HttpException(response.message, HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', storage))
    @Put()
    async uploadFile(@Request() request, @UploadedFile() file, @Body() { userName, theme }): Promise<any> {
        return await this._userService.uploadFile({ id: request.user.idUser, file, userName, theme });
    }
}
