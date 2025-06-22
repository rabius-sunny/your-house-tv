import {
  Building2,
  FileStack,
  FileVideo2,
  Frame,
  Globe,
  Map,
  PieChart,
  RadioTower,
  Settings2,
  TvMinimalPlay
} from 'lucide-react';

export const navData = {
  user: {
    name: 'admin',
    email: 'admin@admin.com',
    avatar: '/avatars/shadcn.jpg'
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: PieChart
    },
    {
      title: 'Networks',
      url: '/dashboard/networks',
      icon: Globe
    },
    {
      title: 'Cities',
      url: '/dashboard/cities',
      icon: Building2
    },
    {
      title: 'Channels',
      url: '/dashboard/channels',
      icon: TvMinimalPlay
    },
    {
      title: 'Stations',
      url: '/dashboard/stations',
      icon: RadioTower
    },
    {
      title: 'Video Gallery',
      url: '#',
      icon: FileVideo2,
      isActive: true,
      items: [
        {
          title: 'Category',
          url: '/dashboard/categories',
          icon: FileStack
        },
        {
          title: 'Videos',
          url: '/dashboard/videos',
          icon: FileVideo2
        }
      ]
    },

    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      isActive: true,
      items: [
        {
          title: 'Hero Sliders',
          url: '/dashboard/sliders',
          icon: Frame
        },
        {
          title: 'Bottom Sliders',
          url: '/dashboard/bottom-sliders',
          icon: Frame
        }
      ]
    }
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map
    }
  ]
};
