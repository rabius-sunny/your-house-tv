'use client';

import { Button } from '@/components/ui/button';
import request from '@/services/http';
import { Sliders as SlidersType } from '@/types';
import { List, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import SliderForm from './SliderForm';
import SliderList from './SliderList';

type TabType = 'list' | 'create';

export default function Sliders() {
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [sliders, setSliders] = useState<SlidersType>([]);
  const [loading, setLoading] = useState(true);

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const response = await request.get('/sliders');
      setSliders(response.data);
    } catch (error) {
      console.error('Error fetching sliders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleSliderCreated = () => {
    fetchSliders();
    setActiveTab('list');
  };

  const handleSliderDeleted = () => {
    fetchSliders();
  };

  const handleSliderUpdated = () => {
    fetchSliders();
  };

  return (
    <div className='space-y-6'>
      {/* Header with Tabs */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        {/* Tab Navigation */}
        <div className='flex items-center gap-2 bg-muted/30 rounded-lg p-1 border border-border/40'>
          <Button
            size='sm'
            variant={activeTab === 'list' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('list')}
            className='h-8 text-xs font-medium transition-all'
          >
            <List className='h-3.5 w-3.5 mr-1.5' />
            All Sliders
          </Button>
          <Button
            size='sm'
            variant={activeTab === 'create' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('create')}
            className='h-8 text-xs font-medium transition-all'
          >
            <Plus className='h-3.5 w-3.5 mr-1.5' />
            Create New
          </Button>
        </div>

        {/* Quick Stats */}
        <div className='flex items-center gap-4 text-sm text-muted-foreground'>
          <span>Total: {sliders.length}</span>
        </div>
      </div>

      {/* Tab Content */}
      <div className='min-h-[400px]'>
        {activeTab === 'list' && (
          <SliderList
            sliders={sliders}
            loading={loading}
            onSliderDeleted={handleSliderDeleted}
            onSliderUpdated={handleSliderUpdated}
            sliderKey='hero_sliders'
            title='Hero Sliders'
          />
        )}

        {activeTab === 'create' && (
          <SliderForm
            onCreate={handleSliderCreated}
            sliderKey='hero_sliders'
            title='Hero Slider'
          />
        )}
      </div>
    </div>
  );
}
