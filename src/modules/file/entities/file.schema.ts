import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class File extends Document {
    @Prop({ required: true })
    filename: string;

    @Prop()
    originalname: string;

    @Prop()
    url: string;

    @Prop({ default: Date.now })
    uploadDate: Date;

    @Prop({ type: [String] })
    tags: string[];

    @Prop({ default: 0 })
    views: number;

    @Prop({ unique: true, sparse: true }) // Optional field, unique and can be null
    shareToken: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
