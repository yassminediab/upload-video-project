export class FileResponseDto {
    id: string;
    filename: string;
    url: string;
    tags: string[];
    views: number;
    uploadDate: Date;
    shareToken?: string;
}
