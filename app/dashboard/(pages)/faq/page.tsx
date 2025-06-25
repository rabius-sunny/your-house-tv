'use client';

import TextEditor from '@/components/shared/TextEditor';
import { Button } from '@/components/ui/button';
import { useAsync } from '@/hooks/useAsync';
import requests from '@/services/http';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function FaqPage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    data,
    loading: contentLoading,
    error
  } = useAsync<string | null>('/settings?key=faq');

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
        key: 'faq',
        value: text
      });
      if (res.data?.ok) {
        toast.success('Faq page updated successfully');
      } else {
        toast.error('Failed to update Faq page');
      }
    } catch (error) {
      console.error('Error updating Faq page:', error);
      toast.error('Failed to update Faq page');
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
