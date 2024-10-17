import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {Model, Types} from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import {File} from "./entities/file.schema";

@Injectable()
export class FileService {
    constructor(@InjectModel(File.name) private fileModel: Model<File>) {}

    async uploadFile(filename: string, originalname: string, url: string, tags: string[]): Promise<File> {
        const file = new this.fileModel({ filename, originalname, url, tags });
        return file.save();
    }

    async getFile(id: string): Promise<File> {
        const file = await this.fileModel.findById(id);
        file.views++;
        await file.save();
        return file;
    }

    async generateShareableLink(id: string): Promise<File> {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Invalid file ID format');
        }
        const file = await this.fileModel.findById(id);
        if (!file) throw new Error('File not found');

        if (!file.shareToken) {
            file.shareToken = uuidv4();
            await file.save();
        }

        return file;
    }

    async getFileByShareToken(shareToken: string): Promise<File> {
        const file = await this.fileModel.findOne({ shareToken });
        if (!file) throw new Error('File not found');

        file.views++;
        await file.save();
        return file;
    }
}
