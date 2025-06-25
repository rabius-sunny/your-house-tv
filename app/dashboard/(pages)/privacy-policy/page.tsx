'use client';

import TextEditor from '@/components/shared/TextEditor';
import { Button } from '@/components/ui/button';
import { useAsync } from '@/hooks/useAsync';
import requests from '@/services/http';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function PrivacyPage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    data,
    loading: contentLoading,
    error
  } = useAsync<string | null>('/settings?key=privacy_policy');

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
        key: 'privacy_policy',
        value: text
      });
      if (res.data?.ok) {
        toast.success('Privacy Policy updated successfully');
      } else {
        toast.error('Failed to update Privacy Policy');
      }
    } catch (error) {
      console.error('Error updating Privacy Policy:', error);
      toast.error('Failed to update Privacy Policy');
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
