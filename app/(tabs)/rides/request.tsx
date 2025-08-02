// app/(tabs)/rides/request.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../../firebase-config';
import { useRouter } from 'expo-router';

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

export default function RequestRideScreen() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [currentRideId, setCurrentRideId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const user = getAuth().currentUser;

  useEffect(() => {
    if (!user) return;

    const unsubscribeUser = onSnapshot(
      doc(firestore, 'users', user.uid),
      (snap) => {
        const data = snap.data();
        setCurrentRideId(data?.rideId || null);
      }
    );

    const unsubscribeRides = onSnapshot(
      collection(firestore, 'rides'),
      (snap) => {
        const allRides = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Ride[];

        const availableRides = allRides.filter(
          (ride) => !ride.passengers?.includes(user.uid)
        );

        setRides(availableRides);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeUser();
      unsubscribeRides();
    };
  }, [user]);

  const handleJoinRide = async (rideId: string, ride: Ride) => {
    if (!user) return;

    if (currentRideId) {
      Alert.alert(
        'Already Joined',
        'You have already joined a ride. Leave it before joining another.'
      );
      return;
    }

    const isFull = (ride.passengers?.length || 0) >= ride.seats;
    if (isFull) {
      Alert.alert('Ride Full', 'Sorry, this ride is already full.');
      return;
    }

    try {
      await updateDoc(doc(firestore, 'rides', rideId), {
        passengers: [...(ride.passengers || []), user.uid],
      });

      await updateDoc(doc(firestore, 'users', user.uid), {
        rideId,
      });

      Alert.alert('Success', 'You have joined the ride!');
    } catch (err) {
      console.error('Error joining ride:', err);
      Alert.alert('Error', 'Failed to join ride.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B5563" />
      </View>
    );
  }

  const renderRideItem = ({ item }: { item: Ride }) => {
    const seatsTaken = item.passengers?.length || 0;
    const isFull = seatsTaken >= item.seats;
    const disabled = currentRideId !== null || isFull;

    return (
      <View style={styles.rideCard}>
        <Text style={styles.rideTitle}>{item.destination}</Text>
        <Text style={styles.rideDetails}>Date: {item.date} • Time: {item.time}</Text>
        <Text style={styles.rideDetails}>
          Seats: {seatsTaken}/{item.seats}
        </Text>

        <TouchableOpacity
          disabled={disabled}
          onPress={() => handleJoinRide(item.id, item)}
          style={[
            styles.joinButton,
            disabled && styles.disabledButton
          ]}
        >
          <Text style={styles.buttonText}>
            {currentRideId
              ? 'You already joined a ride'
              : isFull
              ? 'Full'
              : 'Join Ride'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Rides</Text>

      <FlatList
        data={rides}
        keyExtractor={(item) => item.id}
        renderItem={renderRideItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No rides available.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  rideCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f9fafb',
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
  joinButton: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#16a34a',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 24,
  },
});