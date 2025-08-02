// components/UniversalMap.tsx
import { StyleSheet, View, Text } from 'react-native';
import { useLoadMap } from '../lib/hooks/useLoadMap';

export default function UniversalMap() {
  const { MapView, location, error } = useLoadMap();

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!MapView || !location) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      showsUserLocation
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
});