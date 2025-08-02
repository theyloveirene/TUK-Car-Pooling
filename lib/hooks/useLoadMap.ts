// hooks/useLoadMap.ts
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export function useLoadMap() {
  const [MapView, setMapView] = useState<any>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMap = async () => {
      try {
        const mapModule = await import(
          process.env.EXPO_PUBLIC_PLATFORM === 'web'
            ? '@teovilla/react-native-web-maps'
            : 'react-native-maps'
        );
        setMapView(() => mapModule.default);
      } catch (err) {
        setError('Failed to load maps');
      }
    };

    loadMap();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return { MapView, location, error };
}