export type FileBuffer = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

// Prisma Schema Types
export type User = {
  id: string;
  email: string;
  password: string;
};

export type Gallery = {
  id: string;
  fileId: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
};

export type VideoGallery = {
  id: string;
  fileId: string;
  url: string;
  filePath: string;
  size: number;
  fileType: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Network = {
  id: string;
  name: string;
  slug: string;
  thumbnail: string;
  isFeatured: boolean;
  sortOrder: number;
  city: City[];
  _count: any;
  createdAt: Date;
  updatedAt: Date;
};

export type City = {
  id: string;
  name: string;
  thumbnail: string;
  isFeatured: boolean;
  slug: string;
  network: Network;
  networkId: string;
  channels: Channel[];
  _count: any;
  createdAt: Date;
  updatedAt: Date;
};

export type Channel = {
  id: string;
  name: string;
  slug: string;
  thumbnail: string;
  description: string;
  isFeatured: boolean;
  cityId: string;
  city: City;
  stations: Station[];
  _count: any;
  createdAt: Date;
  updatedAt: Date;
};

export type Station = {
  id: string;
  name: string;
  thumbnail: string;
  description?: string;
  slug: string;
  startedAt: Date;
  endedAt: Date;
  videos: string[];
  _count: any;
  isFeatured: boolean;
  channelId: string;
  channel: Channel;
  createdAt: Date;
  updatedAt: Date;
};

export type VlogCategory = {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  isFeatured: boolean;
  slug: string;
  vlogIds: string[];
  _count: any;
  vlogs: Vlog[];
  createdAt: Date;
  updatedAt: Date;
};

export type Vlog = {
  id: string;
  title: string;
  thumbnail: string;
  description?: string;
  video: string;
  slug: string;
  isFeatured: boolean;
  type: VlogType;
  categories: VlogCategory[];
  categoryIds: string[];
  _count: any;
  createdAt: Date;
  updatedAt: Date;
};

export type Sponsor = {
  id: string;
  name: string;
  designation: string;
  logo: string;
  url: string;
  createdAt: Date;
};

export type Settings = {
  id: string;
  key: string;
  value: any;
};

export type DashboardStats = {
  users: number;
  networks: number;
  cities: number;
  channels: number;
  stations: number;
  blogCategories: number;
  blogs: number;
  vlogCategories: number;
  vlogs: number;
};

export type Sliders = {
  key: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link: string;
  linktext: string;
}[];

export type Contact = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  meta?: any | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CarouselSlide = {
  thumbnail: string;
  name?: string;
  slug: string;
};
export type Resource =
  | 'cities'
  | 'videos'
  | 'channels'
  | 'networks'
  | 'stations'
  | 'vlog-categories'
  | 'blog-categories'
  | 'blogs';

export enum VlogType {
  VLOG = 'VLOG',
  PODCAST = 'PODCAST'
}

export type HomePageData = {
  sliders: Sliders;
};

// Types without relations (for API responses)
export type NetworkWithoutRelations = Omit<Network, 'city'>;
export type CityWithoutRelations = Omit<City, 'network' | 'channels'>;
export type ChannelWithoutRelations = Omit<Channel, 'city' | 'stations'>;
export type StationWithoutRelations = Omit<Station, 'channel'>;
export type VlogCategoryWithoutRelations = Omit<VlogCategory, 'vlogs'>;
export type VlogWithoutRelations = Omit<Vlog, 'categories'>;
export type BlogCategoryWithoutRelations = Omit<BlogCategory, 'blogs'>;
export type BlogWithoutRelations = Omit<Blog, 'categories'>;

export type BlogCategory = {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  isFeatured: boolean;
  slug: string;
  blogIds: string[];
  _count: any;
  blogs: Blog[];
  createdAt: Date;
  updatedAt: Date;
};

export type Blog = {
  id: string;
  title: string;
  thumbnail: string;
  description?: string;
  slug: string;
  isFeatured: boolean;
  categories: BlogCategory[];
  categoryIds: string[];
  _count: any;
  createdAt: Date;
  updatedAt: Date;
};
