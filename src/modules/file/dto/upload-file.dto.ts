import { IsOptional, IsString } from 'class-validator';

export class UploadFileDto {
    @IsOptional()
    @IsString()
    tags: string;
}
