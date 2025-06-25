'use client';

import { Button } from '@/components/ui/button';
import request from '@/services/http';
import { Channel, City } from '@/types';
import { List, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import ChannelList from './ChannelList';
import ChannelComp from './CreateChannel';

type TabType = 'list' | 'create';

type ChannelsProps = {
  cities: City[];
};

export default function Channels({ cities }: ChannelsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChannels = async () => {
    try {
      setLoading(true);
      const response = await request.get('/channel');
      setChannels(response.data);
    } catch (error) {
      console.error('Error fetching channels:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  const handleChannelCreated = () => {
    fetchChannels();
    setActiveTab('list');
  };

  const handleChannelDeleted = () => {
    fetchChannels();
  };

  const handleChannelUpdated = () => {
    fetchChannels();
  };

  return (
    <div className='space-y-6'>
      {/* Header with Tabs */}
      <div className='flex items-center'>
        {/* Tab Navigation */}
        <div className='flex items-center gap-2'>
          <Button
            variant={activeTab === 'list' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setActiveTab('list')}
            className='flex items-center gap-2'
          >
            <List className='h-4 w-4' />
            All Channels
          </Button>
          <Button
            variant={activeTab === 'create' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setActiveTab('create')}
            className='flex items-center gap-2'
          >
            <Plus className='h-4 w-4' />
            Add Channel
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      <div className='min-h-[400px]'>
        {activeTab === 'list' && (
          <div className='animate-in fade-in-0 slide-in-from-right-1 duration-300'>
            <ChannelList
              channels={channels}
              cities={cities}
              loading={loading}
              onChannelDeleted={handleChannelDeleted}
              onChannelUpdated={handleChannelUpdated}
            />
          </div>
        )}

        {activeTab === 'create' && (
          <div className='max-w-4xl mx-auto animate-in fade-in-0 slide-in-from-right-1 duration-300'>
            <ChannelComp
              cities={cities}
              onChannelCreated={handleChannelCreated}
            />
          </div>
        )}
      </div>
    </div>
  );
}
