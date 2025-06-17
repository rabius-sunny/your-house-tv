'use client';

import { useState, useEffect, useCallback } from 'react';

interface TimeSync {
  serverTimeOffset: number;
  isSync: boolean;
  lastSyncTime: number;
}

export const useTimeSync = () => {
  const [timeSync, setTimeSync] = useState<TimeSync>({
    serverTimeOffset: 0,
    isSync: false,
    lastSyncTime: 0
  });

  const syncWithServer = useCallback(async () => {
    try {
      const requestStart = Date.now();
      const response = await fetch('/api/server-time');
      const requestEnd = Date.now();

      if (!response.ok) {
        throw new Error('Failed to sync with server time');
      }

      const data = await response.json();
      const serverTime = new Date(data.serverTime).getTime();

      // Calculate network latency and adjust for it
      const networkLatency = (requestEnd - requestStart) / 2;
      const adjustedServerTime = serverTime + networkLatency;

      // Calculate the offset between server time and client time
      const clientTime = Date.now();
      const offset = adjustedServerTime - clientTime;

      setTimeSync({
        serverTimeOffset: offset,
        isSync: true,
        lastSyncTime: Date.now()
      });

      console.log('Time sync completed:', {
        serverTime: new Date(adjustedServerTime).toISOString(),
        clientTime: new Date(clientTime).toISOString(),
        offset: offset,
        networkLatency: networkLatency
      });
    } catch (error) {
      console.error('Failed to sync with server time:', error);
      // Fallback to client time if sync fails
      setTimeSync({
        serverTimeOffset: 0,
        isSync: false,
        lastSyncTime: Date.now()
      });
    }
  }, []);

  // Get current server-synchronized time
  const getServerTime = useCallback(() => {
    return new Date(Date.now() + timeSync.serverTimeOffset);
  }, [timeSync.serverTimeOffset]);

  // Initial sync and periodic re-sync
  useEffect(() => {
    // Sync immediately
    syncWithServer();

    // Re-sync every 5 minutes to account for clock drift
    const syncInterval = setInterval(syncWithServer, 5 * 60 * 1000);

    return () => clearInterval(syncInterval);
  }, [syncWithServer]);

  return {
    ...timeSync,
    getServerTime,
    syncWithServer
  };
};
