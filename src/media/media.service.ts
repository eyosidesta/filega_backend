import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

interface PresignParams {
  key: string;
  contentType: string;
}

@Injectable()
export class MediaService {
  private s3: S3Client;
  private bucket: string;
  private endpointHost: string;

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.get<string>('DO_SPACES_ENDPOINT');
    const region = this.configService.get<string>('DO_SPACES_REGION');
    const accessKeyId = this.configService.get<string>('DO_SPACES_ACCESS_KEY');
    const secretAccessKey = this.configService.get<string>('DO_SPACES_SECRET_KEY');
    this.bucket = this.configService.get<string>('DO_SPACES_BUCKET') as string;

    if (!endpoint || !region || !accessKeyId || !secretAccessKey || !this.bucket) {
      throw new Error('Missing DigitalOcean Spaces configuration');
    }

    const url = new URL(endpoint);
    this.endpointHost = url.host;

    this.s3 = new S3Client({
      region,
      endpoint,
      forcePathStyle: false,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async createPresignedUrl(params: PresignParams) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: params.key,
      ContentType: params.contentType,
      ACL: 'public-read',
    });

    try {
      const uploadUrl = await getSignedUrl(this.s3, command, { expiresIn: 300 }); // 5 minutes
      const publicUrl = `https://${this.bucket}.${this.endpointHost}/${params.key}`;
      return { uploadUrl, publicUrl, key: params.key };
    } catch (error) {
      throw new InternalServerErrorException('Failed to generate presigned URL');
    }
  }
}


