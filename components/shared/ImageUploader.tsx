'use client';

import { uploadFiles } from '@/helper/fileUploader';
import { FileBuffer } from '@/types';
import { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '../ui/input';

type TProps = {
  setSelectedFile: (file: string) => void;
  isLoading?: boolean;
};

export default function ImageUploader({ setSelectedFile, isLoading }: TProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoading(true);
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp'
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type', {
          description: 'Please select a valid image file (JPEG, PNG, WebP)'
        });
        setLoading(false);
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error('File too large', {
          description: 'Please select a file smaller than 5MB'
        });
        setLoading(false);
        return;
      }

      setFile(file);

      if (file) {
        const uploadResult = await uploadFiles(
          [await convertFileToBuffer(file)],
          // existing file url for deleting previous file when update a network's thumbnail
          ['']
        );
        setLoading(false);
        if (uploadResult?.error || !uploadResult.data) {
          toast.error(uploadResult.error);
          setLoading(false);
          return;
        }

        if (uploadResult.data?.length > 0) {
          setSelectedFile(uploadResult.data[0]);
        } else {
          setLoading(false);
          throw new Error('Failed to upload file');
        }
      }
    }
  };

  const convertFileToBuffer = async (file: File): Promise<FileBuffer> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const buffer = Buffer.from(arrayBuffer);

        resolve({
          fieldname: 'thumbnail',
          originalname: file.name,
          encoding: '7bit',
          mimetype: file.type,
          buffer: buffer,
          size: file.size
        });
      };
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div>
      <Input
        type='file'
        accept='image/*'
        onChange={handleFileChange}
        disabled={isLoading || loading}
        className='file:border-0 file:text-sm file:font-semibold '
      />
      {loading && (
        <p className='text-xs mt-1 ml-3 text-green-600 animate-caret-blink font-medium'>
          Uploading file...
        </p>
      )}
      {file && (
        <p className='text-xs mt-1 ml-3 text-muted-foreground'>
          Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
        </p>
      )}
    </div>
  );
}
