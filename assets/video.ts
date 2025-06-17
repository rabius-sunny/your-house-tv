export const channel = {
  name: 'Your House TV',
  description:
    'Your House TV is a collection of videos that you can watch in your house',
  startedAt: '2025-06-17T00:00:00Z', // Updated to current date
  endedAt: '2025-12-31T23:59:59Z', // Extended end date
  videos: [
    {
      id: 1,
      url: `https://YHTV-pullzone123.b-cdn.net/lowe's_ad_-_out_of_the_blue%20(720p).mp4`,
      duration: 40
    },
    // {
    //   id: 1,
    //   url: 'https://YHTV-pullzone123.b-cdn.net/susan_b_komen_-_psa..._the_power_of_one%20(720p).mp4',
    //   duration: 40
    // },
    {
      id: 2,
      url: 'https://YHTV-pullzone123.b-cdn.net/test%20folder/332_mill_creek_drive_clayton%2C_nc_27527%20(720p).mp4',
      duration: 40
    },
    {
      id: 3,
      url: `https://yhtv-pullzone123.b-cdn.net/home_depot_ad_-_doer's_do%20(720p).mp4`,
      duration: 40
    }
  ]
};

export type TVideo = typeof channel;
