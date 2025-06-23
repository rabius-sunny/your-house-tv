'use client';

import { Button } from '@/components/ui/button';
import request from '@/services/http';
import { Network } from '@/types';
import { List, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import NetworkComp from './Network';
import NetworkList from './NetworkList';

type TabType = 'list' | 'create';

export default function Networks() {
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [networks, setNetworks] = useState<Network[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNetworks = async () => {
    try {
      setLoading(true);
      const response = await request.get('/network');
      setNetworks(response.data);
    } catch (error) {
      console.error('Error fetching networks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworks();
  }, []);

  const handleNetworkCreated = () => {
    fetchNetworks();
    setActiveTab('list');
  };

  const handleNetworkDeleted = () => {
    fetchNetworks();
  };

  return (
    <div className='space-y-6'>
      {/* Header with Tabs */}
      <div className='flex gap-3'>
        {/* Tab Navigation */}
        <div className='flex items-center bg-muted/30 rounded-lg p-1 gap-2 border border-border/40'>
          <Button
            variant={activeTab === 'list' ? 'default' : 'ghost'}
            size='sm'
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 transition-all duration-200}`}
          >
            <List className='h-4 w-4' />
            Networks
            {networks.length > 0 && (
              <span className='ml-1 px-1.5 py-0.5 text-xs bg-muted rounded text-muted-foreground'>
                {networks.length}
              </span>
            )}
          </Button>
          <Button
            variant={activeTab === 'create' ? 'default' : 'ghost'}
            size='sm'
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 transition-all duration-200`}
          >
            <Plus className='h-4 w-4' />
            Create New
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      <div className='min-h-[400px]'>
        {activeTab === 'list' && (
          <div className='animate-in fade-in-0 slide-in-from-right-1 duration-300'>
            <NetworkList
              networks={networks}
              loading={loading}
              onNetworkDeleted={handleNetworkDeleted}
            />
          </div>
        )}

        {activeTab === 'create' && (
          <div className='animate-in fade-in-0 slide-in-from-right-1 duration-300'>
            <div className='flex justify-center'>
              <NetworkComp onCreate={handleNetworkCreated} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
