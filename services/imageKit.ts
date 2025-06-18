import { FileBuffer } from '@/types';
import { generateRandomString } from '@/utils/random';
import ImageKit from 'imagekit';

// Type for our service's upload response
interface UploadResponse {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  height: number;
  width: number;
  size: number;
  filePath: string;
  tags?: string[];
  AITags?: any[];
  versionInfo?: {
    id: string;
    name: string;
  };
  isPrivateFile: boolean;
  customCoordinates?: string;
  metadata?: Record<string, any>;
  fileType: string;
}

class ImageKitService {
  private imagekit: ImageKit;
  private urlEndpoint: string;

  constructor() {
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '';
    const privateKey = process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY || '';
    this.urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '';

    if (!publicKey || !privateKey || !this.urlEndpoint) {
      console.warn(
        'ImageKit configuration is incomplete. Check your environment variables.'
      );
    }

    this.imagekit = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint: this.urlEndpoint
    });
  }

  /**
   * Upload a single file to ImageKit
   * @param file - The file buffer object
   * @returns Promise with the upload response
   */
  async uploadFile(file: FileBuffer): Promise<UploadResponse> {
    try {
      // Convert buffer to base64 for ImageKit
      const base64Data = file.buffer.toString('base64');
      const fileName = `${generateRandomString(6)}${file.originalname.replace(
        /[^a-zA-Z0-9]/g,
        ''
      )}`;

      // The imagekit.upload method requires a callback, but we want to use Promises
      return await new Promise<UploadResponse>((resolve, reject) => {
        this.imagekit.upload(
          {
            file: base64Data,
            fileName,
            useUniqueFileName: true,
            tags: [file.mimetype.split('/')[0]]
          },
          (err, result) => {
            if (err) {
              console.error('ImageKit upload error:', err);
              return reject(err);
            }
            resolve(result as UploadResponse);
          }
        );
      });
    } catch (error) {
      console.error('Error in uploadFile:', error);
      throw error;
    }
  }

  /**
   * Upload multiple files to ImageKit
   * @param files - Array of file buffer objects
   * @returns Promise with array of upload responses
   */
  async uploadMultipleFiles(files: FileBuffer[]): Promise<UploadResponse[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file));
    return Promise.all(uploadPromises);
  }

  /**
   * Delete a file from ImageKit by ID
   * @param fileId - The ID of the file to delete
   * @returns Promise with deletion response
   */
  async deleteFile(fileId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.imagekit.deleteFile(fileId, (err: any, result: any) => {
        if (err) {
          console.error('ImageKit delete error:', err);
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  /**
   * Delete multiple files from ImageKit
   * @param fileIds - Array of file IDs to delete
   * @returns Promise with array of deletion responses
   */
  async deleteMultipleFiles(fileIds: string[]): Promise<any[]> {
    const deletePromises = fileIds.map((id) => this.deleteFile(id));
    return Promise.all(deletePromises);
  }
}

const imageKitService = new ImageKitService();

export default imageKitService;
