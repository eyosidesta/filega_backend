import { Body, Controller, Post } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import { MediaService } from './media.service';

class PresignDto {
  @IsOptional()
  @IsString()
  folder?: string;

  @IsString()
  filename: string;

  @IsString()
  contentType: string;
}

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('presign')
  async presign(@Body() body: PresignDto) {
    const folder = body.folder || 'businesses';
    const key = `${folder}/${Date.now()}-${body.filename}`;
    return this.mediaService.createPresignedUrl({
      key,
      contentType: body.contentType,
    });
  }
}



