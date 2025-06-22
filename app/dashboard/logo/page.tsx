'use client';

import ImageUploader from '@/components/shared/ImageUploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import requests from '@/services/http';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type TProps = {};

export default function Logo({}: TProps) {
  const [logo, setLogo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentLogo, setCurrentLogo] = useState<string | null>(null);

  // Fetch existing logo on component mount
  useEffect(() => {
    const fetchCurrentLogo = async () => {
      try {
        const response = await requests.get('/logo');
        if (response.data.logo) {
          setCurrentLogo(response.data.logo);
        }
      } catch (error) {
        console.error('Error fetching current logo:', error);
      }
    };

    fetchCurrentLogo();
  }, []);

  const handleSubmit = async () => {
    if (!logo) {
      toast.error('Please select a logo to upload.');
      return;
    }

    try {
      setLoading(true);
      const response = await requests.post('/logo', { logo });
      toast.success('Logo uploaded successfully!');
      setCurrentLogo(logo);
      setLogo(null); // Reset the uploader
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentLogo) return;

    try {
      setLoading(true);
      await requests.delete('/logo');
      toast.success('Logo deleted successfully!');
      setCurrentLogo(null);
    } catch (error: any) {
      console.error('Error deleting logo:', error);
      toast.error('Failed to delete logo.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Card className='w-full max-w-2xl mx-auto'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>Site Logo</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Current Logo Display */}
          {currentLogo && (
            <div className='mb-6 p-4 border rounded-lg bg-gray-50'>
              <Label className='text-sm font-medium mb-2 block'>
                Current Logo
              </Label>
              <div className='flex items-center gap-4'>
                <img
                  src={currentLogo}
                  alt='Current logo'
                  className='h-16 w-auto object-contain border rounded'
                />
                <Button
                  onClick={handleDelete}
                  variant='destructive'
                  size='sm'
                  disabled={loading}
                >
                  Delete Current Logo
                </Button>
              </div>
            </div>
          )}

          <div className='space-y-2'>
            <Label>Upload New Logo</Label>
            <ImageUploader setSelectedFile={setLogo} />
            <p className='text-xs text-muted-foreground'>
              Recommended size: 400x280px
            </p>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-4 pt-4 mt-10'>
            <Button
              onClick={handleSubmit}
              type='submit'
              disabled={loading || !logo}
              className='flex-1'
            >
              {loading
                ? 'Uploading...'
                : currentLogo
                ? 'Update Logo'
                : 'Upload Logo'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
