import {
  Building2,
  Facebook,
  FileStack,
  FileVideo2,
  Frame,
  Globe,
  Image,
  Instagram,
  Linkedin,
  Map,
  PieChart,
  RadioTower,
  Settings2,
  TextIcon,
  TextSelect,
  TvMinimalPlay,
  Twitter,
  UserCog2Icon
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
      title: 'Blogs',
      url: '#',
      icon: TextIcon,
      items: [
        {
          title: 'Blogs',
          url: '/dashboard/blogs',
          icon: TextIcon
        },
        {
          title: 'Blog Categories',
          url: '/dashboard/blog-categories',
          icon: FileStack
        }
      ]
    },
    {
      title: 'Video Gallery',
      url: '#',
      icon: FileVideo2,
      items: [
        {
          title: 'Video Category',
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
      items: [
        {
          title: 'Logo',
          url: '/dashboard/logo',
          icon: Image
        },
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
    },
    {
      title: 'Pages',
      url: '#',
      icon: TextSelect,
      items: [
        {
          title: 'Cookie Policy',
          url: '/dashboard/cookie-policy',
          icon: TextSelect
        },
        {
          title: 'Privace Policy',
          url: '/dashboard/privacy-policy',
          icon: TextSelect
        },
        {
          title: 'Terms & Conditions',
          url: '/dashboard/terms-and-conditions',
          icon: TextSelect
        },
        {
          title: 'Faq',
          url: '/dashboard/faq',
          icon: TextSelect
        },
        {
          title: 'About Us',
          url: '/dashboard/about-us',
          icon: TextSelect
        }
      ]
    },
    {
      title: 'Sponsors',
      url: '/dashboard/sponsors',
      icon: Building2
    },
    {
      title: 'Users',
      url: '/dashboard/users',
      icon: UserCog2Icon
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

export const frontendNavData = [
  {
    title: 'Home',
    url: '/'
  },
  {
    title: 'Networks',
    url: '/networks'
  },
  {
    title: 'Cities',
    url: '/cities'
  },
  {
    title: 'Channels',
    url: '/channels'
  },

  {
    title: 'Blogs',
    url: '/blogs'
  }
];

export const footerData = {
  description:
    'YourHouseTV, Rogue Wolf, LLC, and all other programs and/or marks are the property of their respective owners. All rights reserved.',
  policyLinks: [
    {
      title: 'Privacy Policy',
      url: '/privacy-policy'
    },
    {
      title: 'Terms & Conditions',
      url: '/terms-and-conditions'
    },
    {
      title: 'Cookie Policy',
      url: '/cookie-policy'
    }
  ],
  infoLinks: [
    {
      title: 'Faq',
      url: '/faq'
    },
    {
      title: 'Contact Us',
      url: '/contact-us'
    },
    {
      title: 'About Us',
      url: '/about-us'
    }
  ],
  socialLinks: [
    {
      title: 'Facebook',
      url: 'https://www.facebook.com/YourHouseTV',
      icon: Facebook
    },
    {
      title: 'Twitter',
      url: 'https://twitter.com/YourHouseTV',
      icon: Twitter
    },
    {
      title: 'Instagram',
      url: 'https://www.instagram.com/YourHouseTV',
      icon: Instagram
    },
    {
      title: 'LinkedIn',
      url: 'https://www.linkedin.com/company/yourhousetv',
      icon: Linkedin
    }
  ]
};
