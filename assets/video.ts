export const channel = {
  name: 'Your House TV',
  description:
    'Your House TV is a collection of videos that you can watch in your house',
  startedAt: '2025-06-17T00:00:00Z', // Updated to current date
  endedAt: '2025-12-31T23:59:59Z', // Extended end date
  videos: [
    {
      id: 1,
      url: 'https://YHTV-pullzone123.b-cdn.net/test%20folder/332_mill_creek_drive_clayton%2C_nc_27527%20(720p).mp4',
      duration: 300 // 5 minutes in seconds
    },
    {
      id: 2,
      url: 'https://YHTV-pullzone123.b-cdn.net/test%20folder/3924-ivory-rose-lnbranded%20(720p).mp4',
      duration: 420 // 7 minutes in seconds
    }
  ]
};

export type TVideo = typeof channel;
