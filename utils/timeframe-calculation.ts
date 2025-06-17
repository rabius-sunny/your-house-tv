const startedAt = new Date('2025-06-15T00:00:00Z');
const videoLength = 300;
const currentTime = new Date();
const totalSeconds = Math.floor(
  (currentTime.getTime() - startedAt.getTime()) / 1000
);

const currentVideoIndex = Math.floor(totalSeconds / videoLength);

console.log('data', {
  videoLength,
  totalSeconds,
  currentVideoIndex
});
