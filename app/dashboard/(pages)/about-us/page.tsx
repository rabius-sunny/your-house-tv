'use client';

import TextEditor from '@/components/shared/TextEditor';
import { Button } from '@/components/ui/button';
import { useAsync } from '@/hooks/useAsync';
import requests from '@/services/http';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function AboutPage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    data,
    loading: contentLoading,
    error
  } = useAsync<string | null>('/settings?key=about_us');

  useEffect(() => {
    if (data) {
      setText(data);
    }
  }, [data]);

  if (contentLoading) {
    return <div>Loading...</div>;
  }

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await requests.post('/settings', {
        key: 'about_us',
        value: text
      });
      if (res.data?.ok) {
        toast.success('About us updated successfully');
      } else {
        toast.error('Failed to update About us');
      }
    } catch (error) {
      console.error('Error updating About us:', error);
      toast.error('Failed to update About us');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='mb-4'>
        <Button
          disabled={loading}
          onClick={handleUpdate}
        >
          {loading ? 'Updating Page...' : 'Update Page'}
        </Button>
      </div>
      <TextEditor
        state={text}
        setState={setText}
      />
    </div>
  );
}
