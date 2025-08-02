// app/(tabs)/rides/upcoming.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { firestore } from '../../../firebase-config';
import { collection, query, where, orderBy, onSnapshot, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';
import AnimatedView from '../../../components/AnimatedView';

interface Ride {
  id: string;
  destination: string;
  date: string;
  time: string;
  seats: number;
  passengers: string[];
  driverId?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export default function UpcomingRidesScreen() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const user = getAuth().currentUser;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const userDocRef = doc(firestore, 'users', user.uid);

    const unsubscribeUser = onSnapshot(userDocRef, (userSnapshot) => {
      const userRole = userSnapshot.data()?.role;
      if (!userRole) {
        setRides([]);
        setLoading(false);
        return;
      }

      const ridesRef = collection(firestore, 'rides');
      const ridesQuery = query(
        ridesRef,
        userRole === 'driver'
          ? where('driverId', '==', user.uid)
          : where('passengers', 'array-contains', user.uid),
        where('status', '==', 'upcoming'),
        orderBy('date', 'asc') 
      );

      const unsubscribeRides = onSnapshot(ridesQuery, (ridesSnapshot) => {
        const data = ridesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Ride[];
        setRides(data);
        setLoading(false);
      });

      return () => unsubscribeRides();
    });

    return () => unsubscribeUser();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B5563" />
      </View>
    );
  }

  if (rides.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <AnimatedView
          source={require('../../../assets/lottie/empty-ghost.json')}
          style={styles.lottie}
        />
        <Text style={styles.emptyText}>No upcoming rides found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Rides</Text>
      <FlatList
        data={rides}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const remainingSeats = item.seats - (item.passengers?.length || 0);
          return (
            <TouchableOpacity
              onPress={() => router.push(`/rides/${item.id}`)}
              style={styles.rideCard}
            >
              <Text style={styles.rideTitle}>{item.destination}</Text>
              <Text style={styles.rideDetails}>📅 {item.date}  🕒 {item.time}</Text>
              <Text style={styles.rideDetails}>🪑 Seats Remaining: {remainingSeats}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  lottie: {
    width: 250,
    height: 250,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 18,
    marginTop: 24,
    textAlign: 'center',
    fontWeight: '500',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  rideCard: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  rideTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  rideDetails: {
    color: '#6b7280',
    marginTop: 4,
  },
});