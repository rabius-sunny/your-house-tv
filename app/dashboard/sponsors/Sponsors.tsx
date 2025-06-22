'use client';

import { Button } from '@/components/ui/button';
import request from '@/services/http';
import { Sponsor } from '@/types';
import { Plus, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import SponsorForm from './SponsorForm';
import SponsorList from './SponsorList';

const tabs = [
  { id: 'list', label: 'All Sponsors', icon: Users },
  { id: 'create', label: 'Create Sponsor', icon: Plus }
];

export default function Sponsors() {
  const [activeTab, setActiveTab] = useState('list');
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSponsors = async () => {
    try {
      setLoading(true);
      const response = await request.get('/sponsors');
      setSponsors(response.data);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      toast.error('Failed to fetch sponsors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const handleSponsorCreated = () => {
    fetchSponsors();
    setActiveTab('list');
  };

  const handleSponsorDeleted = () => {
    fetchSponsors();
  };

  const handleSponsorUpdated = () => {
    fetchSponsors();
  };

  return (
    <div className='container mx-auto py-6 space-y-6'>
      {/* Header */}
      <div className='space-y-4'>
        {/* Tabs */}
        <div className='flex items-center gap-2 bg-muted/30 rounded-lg p-1 border border-border/40'>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab.id)}
                className='h-8 text-xs font-medium transition-all'
                size='lg'
              >
                <Icon className='h-4 w-4 mr-2' />
                {tab.label}
                {tab.id === 'list' && !loading && (
                  <span className='ml-2 text-xs  px-2 py-1 rounded-full'>
                    {sponsors.length}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className='space-y-6'>
        {activeTab === 'list' && (
          <SponsorList
            sponsors={sponsors}
            loading={loading}
            onSponsorDeleted={handleSponsorDeleted}
            onSponsorUpdated={handleSponsorUpdated}
          />
        )}

        {activeTab === 'create' && (
          <SponsorForm onCreate={handleSponsorCreated} />
        )}
      </div>
    </div>
  );
}
