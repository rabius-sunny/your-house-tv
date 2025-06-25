'use client';

import { Button } from '@/components/ui/button';
import request from '@/services/http';
import { City, Network } from '@/types';
import { List, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import CityList from './CityList';
import CityComp from './CreateCity';

type TabType = 'list' | 'create';

export default function Cities() {
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [cities, setCities] = useState<City[]>([]);
  const [networks, setNetworks] = useState<Network[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const response = await request.get('/city');
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNetworks = async () => {
    try {
      const response = await request.get('/network');
      setNetworks(response.data);
    } catch (error) {
      console.error('Error fetching networks:', error);
    }
  };

  useEffect(() => {
    fetchCities();
    fetchNetworks();
  }, []);

  const handleCityCreated = () => {
    fetchCities();
    setActiveTab('list');
  };

  const handleCityDeleted = () => {
    fetchCities();
  };

  const handleCityUpdated = () => {
    fetchCities();
  };

  return (
    <div className='space-y-6'>
      {/* Header with Tabs */}
      <div className='flex items-center'>
        {/* Tab Navigation */}
        <div className='flex items-center bg-muted/30 rounded-lg p-1 gap-2 border border-border/40'>
          <Button
            variant={activeTab === 'list' ? 'default' : 'ghost'}
            size='sm'
            onClick={() => setActiveTab('list')}
            className='flex items-center gap-2 transition-all duration-200'
          >
            <List className='h-4 w-4' />
            Cities
            {cities.length > 0 && (
              <span className='ml-1 px-1.5 py-0.5 text-xs bg-muted rounded text-muted-foreground'>
                {cities.length}
              </span>
            )}
          </Button>
          <Button
            variant={activeTab === 'create' ? 'default' : 'ghost'}
            size='sm'
            onClick={() => setActiveTab('create')}
            className='flex items-center gap-2 transition-all duration-200'
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
            <CityList
              cities={cities}
              networks={networks}
              loading={loading}
              onCityDeleted={handleCityDeleted}
              onCityUpdated={handleCityUpdated}
            />
          </div>
        )}

        {activeTab === 'create' && (
          <div className='animate-in fade-in-0 slide-in-from-right-1 duration-300'>
            <div className='flex justify-center'>
              <CityComp
                onCreate={handleCityCreated}
                networks={networks}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
