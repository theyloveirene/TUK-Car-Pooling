import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../../lib/hooks/useAuth';

export default function Index() {
  const { currentUser } = useAuth();

  // While loading user auth state
  if (!currentUser) {
    return (
      <View style={styles.splash}>
        <Text style={styles.title}>TUK Car-pool</Text>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return <Redirect href="/rides" />;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
});
