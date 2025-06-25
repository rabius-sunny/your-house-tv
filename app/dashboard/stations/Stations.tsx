'use client';

import { Button } from '@/components/ui/button';
import request from '@/services/http';
import { Channel, Station } from '@/types';
import { List, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import CreateStationComp from './CreateStation';
import StationList from './StationList';

type TabType = 'list' | 'create';

type StationsProps = {
  channels: Channel[];
};

export default function Stations({ channels }: StationsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStations = async () => {
    try {
      setLoading(true);
      const response = await request.get('/station');
      setStations(response.data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleStationCreated = () => {
    fetchStations();
    setActiveTab('list');
  };

  const handleStationDeleted = () => {
    fetchStations();
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
            All Stations
          </Button>
          <Button
            variant={activeTab === 'create' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setActiveTab('create')}
            className='flex items-center gap-2'
          >
            <Plus className='h-4 w-4' />
            Add Station
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      <div className='min-h-[400px]'>
        {activeTab === 'list' && (
          <div className='animate-in fade-in-0 slide-in-from-right-1 duration-300'>
            <StationList
              stations={stations}
              loading={loading}
              onStationDeleted={handleStationDeleted}
            />
          </div>
        )}

        {activeTab === 'create' && (
          <div className='max-w-4xl mx-auto animate-in fade-in-0 slide-in-from-right-1 duration-300'>
            <CreateStationComp
              channels={channels}
              onCreate={handleStationCreated}
            />
          </div>
        )}
      </div>
    </div>
  );
}
