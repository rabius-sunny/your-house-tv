import { FileBuffer } from '@/types';
import { generateRandomString } from '@/utils/random';

// Type for Bunny Storage upload response
interface BunnyUploadResponse {
  fileId: string;
  name: string;
  url: string;
  size: number;
  filePath: string;
  fileType: string;
}

class BunnyStorageService {
  private baseUrl: string;
  private storageZoneName: string;
  private accessKey: string;
  private pullZoneUrl: string;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_BUNNY_STORAGE_BASE_URL ||
      'https://storage.bunnycdn.com';
    this.storageZoneName =
      process.env.NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME || '';
    this.accessKey = process.env.NEXT_PUBLIC_BUNNY_STORAGE_ACCESS_KEY || '';
    this.pullZoneUrl = process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE_URL || '';

    if (!this.storageZoneName || !this.accessKey || !this.pullZoneUrl) {
      console.warn(
        'Bunny Storage configuration is incomplete. Check your environment variables.'
      );
    }
  }

  /**
   * Upload a single video file to Bunny Storage
   * @param file - The file buffer object
   * @returns Promise with the upload response
   */
  async uploadVideo(file: FileBuffer): Promise<BunnyUploadResponse> {
    try {
      // Generate unique filename
      const fileExtension = file.originalname.split('.').pop() || 'mp4';
      const fileName = `${generateRandomString(10)}_${file.originalname.replace(
        /[^a-zA-Z0-9._-]/g,
        ''
      )}`;
      const filePath = `videos/${fileName}`;

      // Upload to Bunny Storage
      const response = await fetch(
        `${this.baseUrl}/${this.storageZoneName}/${filePath}`,
        {
          method: 'PUT',
          headers: {
            AccessKey: this.accessKey,
            'Content-Type': file.mimetype
          },
          body: file.buffer
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Bunny Storage upload failed: ${response.status} - ${errorText}`
        );
      }

      // Construct the public URL
      const publicUrl = `${this.pullZoneUrl}/${filePath}`;

      return {
        fileId: fileName, // Use filename as fileId for Bunny Storage
        name: fileName,
        url: publicUrl,
        size: file.size,
        filePath,
        fileType: file.mimetype
      };
    } catch (error) {
      console.error('Error in uploadVideo:', error);
      throw error;
    }
  }

  /**
   * Upload multiple video files to Bunny Storage
   * @param files - Array of file buffer objects
   * @returns Promise with array of upload responses
   */
  async uploadMultipleVideos(
    files: FileBuffer[]
  ): Promise<BunnyUploadResponse[]> {
    const uploadPromises = files.map((file) => this.uploadVideo(file));
    return Promise.all(uploadPromises);
  }

  /**
   * Delete a video file from Bunny Storage
   * @param filePath - The file path to delete
   * @returns Promise with deletion response
   */
  async deleteVideo(filePath: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.storageZoneName}/${filePath}`,
        {
          method: 'DELETE',
          headers: {
            AccessKey: this.accessKey
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete video: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting video:', error);
      return false;
    }
  }

  /**
   * Delete multiple video files from Bunny Storage
   * @param filePaths - Array of file paths to delete
   * @returns Promise with array of deletion results
   */
  async deleteMultipleVideos(filePaths: string[]): Promise<boolean[]> {
    const deletePromises = filePaths.map((path) => this.deleteVideo(path));
    return Promise.all(deletePromises);
  }

  /**
   * Get video information from Bunny Storage
   * @param filePath - The file path to get info for
   * @returns Promise with file information
   */
  async getVideoInfo(filePath: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.storageZoneName}/${filePath}`,
        {
          method: 'HEAD',
          headers: {
            AccessKey: this.accessKey
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get video info: ${response.status}`);
      }

      return {
        size: response.headers.get('content-length'),
        type: response.headers.get('content-type'),
        lastModified: response.headers.get('last-modified')
      };
    } catch (error) {
      console.error('Error getting video info:', error);
      throw error;
    }
  }
}

const bunnyStorageService = new BunnyStorageService();

export default bunnyStorageService;
