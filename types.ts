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
  thumbnail: string;
  isFeatured: boolean;
  city: City[];
  createdAt: Date;
  updatedAt: Date;
};

export type City = {
  id: string;
  name: string;
  thumbnail: string;
  isFeatured: boolean;
  network: Network;
  networkId: string;
  channels: Channel[];
  createdAt: Date;
  updatedAt: Date;
};

export type Channel = {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
  isFeatured: boolean;
  cityId: string;
  city: City;
  stations: Station[];
  createdAt: Date;
  updatedAt: Date;
};

export type Station = {
  id: string;
  name: string;
  thumbnail: string;
  startedAt: Date;
  endedAt: Date;
  videos: string[];
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
  vlogIds: string[];
  vlogs: Vlog[];
  createdAt: Date;
  updatedAt: Date;
};

export type Vlog = {
  id: string;
  title: string;
  video: string;
  isFeatured: boolean;
  type: VlogType;
  categories: VlogCategory[];
  categoryIds: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type Settings = {
  id: string;
  key: string;
  value: string;
};

export enum VlogType {
  VLOG = 'VLOG',
  PODCAST = 'PODCAST'
}

// Types without relations (for API responses)
export type NetworkWithoutRelations = Omit<Network, 'city'>;
export type CityWithoutRelations = Omit<City, 'network' | 'channels'>;
export type ChannelWithoutRelations = Omit<Channel, 'city' | 'stations'>;
export type StationWithoutRelations = Omit<Station, 'channel'>;
export type VlogCategoryWithoutRelations = Omit<VlogCategory, 'vlogs'>;
export type VlogWithoutRelations = Omit<Vlog, 'categories'>;
