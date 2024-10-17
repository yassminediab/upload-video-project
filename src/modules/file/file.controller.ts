import {
    Controller,
    Post,
    Get,
    Param,
    Res,
    UploadedFile,
    UseInterceptors,
    Body,
    NotFoundException,
    UseGuards, UseFilters, Req, Headers, Query
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileService } from './file.service';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';
import {UploadFileDto} from "./dto/upload-file.dto";
import {JwtAuthGuard} from "../auth/jwt-auth-guard";
import {BadRequestExceptionFilter} from "../../filters/bad-request-exception";
import {InternalServerErrorExceptionFilter} from "../../filters/internal-server-error-exception";
import {TransformResponseInterceptor} from "../../interceptors/transform-response.interceptor";
import {Types} from "mongoose";
import * as path from 'path';
import * as mime from 'mime-types';

@Controller('files')
@UseFilters(BadRequestExceptionFilter)
@UseFilters(InternalServerErrorExceptionFilter)
@UseInterceptors(TransformResponseInterceptor)
export class FileController {
    constructor(private readonly fileService: FileService) {}

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                const filename = `${uuidv4()}-${file.originalname}`;
                callback(null, filename);
            },
        }),
    }))
    async uploadFile(@UploadedFile() file, @Body() uploadFileDto: UploadFileDto,
                     @Req() req: Request & { protocol: string },
                     @Headers() headers: Record<string, string>) {
        const host = headers['host'];
        const baseUrl = `${req.protocol}://${host}`;
        const fileUrl = `${baseUrl}/uploads/${file.filename}`;
        return this.fileService.uploadFile(file.filename, file.originalname, fileUrl, uploadFileDto.tags ? uploadFileDto.tags.split(',') : []);
    }
    @Get('shared')
    async getFileByShareToken(@Query('shareToken') shareToken: string, @Res() res: Response) {

        console.log('Share token received:', shareToken);

        const file = await this.fileService.getFileByShareToken(shareToken);
        if (!file) throw new NotFoundException('File not found');

        // Set the appropriate content type based on the file extension
        const filePath = path.join(__dirname, '..', 'uploads', file.url);
        const mimeType = mime.lookup(filePath) || 'application/octet-stream';
        res.setHeader('Content-Type', mimeType);

        // Stream the file to the user
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error serving the file');
            }
        });
    }


    @Post('file/:id/share')
    async generateShareableLink(@Param('id') id: string,
                                @Req() req: Request & { protocol: string },
                                @Headers() headers: Record<string, string>
    ) {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Invalid ID format');
        }
        const file = await this.fileService.generateShareableLink(id);

        const host = headers['host'];
        const baseUrl = `${req.protocol}://${host}`;
        return {
            //shareableLink: `${baseUrl}/${file.shareToken}`,
            shareableLink: file.shareToken
        };
    }

    @Get('id/:fileId')
    @UseGuards(JwtAuthGuard)
    async getFile(@Param('fileId') fileId: string) {
        const file = await this.fileService.getFile(fileId);
        if (!file) throw new NotFoundException('File not found');
        return file;
    }
}
