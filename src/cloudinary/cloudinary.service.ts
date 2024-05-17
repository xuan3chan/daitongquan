import { Injectable } from '@nestjs/common';
import { v2, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';
@Injectable()
export class CloudinaryService {
  constructor() {
    v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImageService(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = v2.uploader.upload_stream(
        { folder: 'daitongquan' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
  async deleteImageService(url: string) {
    // Extract the publicId from the URL
    //e.g. 'http://res.cloudinary.com/dtvhqvucg/image/upload/v1715938535/daitongquan/putnzqkzwviqwfuwlnfx.png'
    // => 'daitongquan/putnzqkzwviqwfuwlnfx'
    const publicId = url.split('/').slice(-2).join('/').split('.')[0];
    console.log(publicId);
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
}
