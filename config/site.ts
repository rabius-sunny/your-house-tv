import { EmblaOptionsType } from 'embla-carousel';

export const EmblaOptions: EmblaOptionsType = {
  loop: false,
  slidesToScroll: 1
};
export const skipApi = process.env.SKIP_API === 'true';
