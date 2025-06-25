'use client';

import TextEditor from '@/components/shared/TextEditor';
import { Button } from '@/components/ui/button';
import { useAsync } from '@/hooks/useAsync';
import requests from '@/services/http';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function TermsPage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    data,
    loading: contentLoading,
    error
  } = useAsync<string | null>('/settings?key=terms_conditions');

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
        key: 'terms_conditions',
        value: text
      });
      if (res.data?.ok) {
        toast.success('Terms and Conditions updated successfully');
      } else {
        toast.error('Failed to update Terms and Conditions');
      }
    } catch (error) {
      console.error('Error updating Terms and Conditions:', error);
      toast.error('Failed to update Terms and Conditions');
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
