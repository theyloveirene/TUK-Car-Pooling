// app/(tabs)/rides/index.tsx
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { collection, doc, getDoc, onSnapshot, query, where, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { firestore } from '../../../firebase-config';
import { useAuth } from '../../../lib/hooks/useAuth';
import { useRouter } from 'expo-router';
import UniversalMap from '../../../components/UniversalMap';
import dayjs from 'dayjs';
import RideCard from '../../../components/RideCard';

interface Ride {
  id: string;
  driverId: string;
  driverName: string;
  pickup: string;
  destination: string;
  time: string;
  date: string;
  availableSeats: number;
  passengers: string[];
}

export default function DashboardScreen() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [myRide, setMyRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const role = currentUser.role;
    const uid = currentUser.uid;

    const q = query(
      collection(firestore, 'rides'),
      where(role === 'driver' ? 'driverId' : 'passengers', 'array-contains', uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const rides: Ride[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Ride, 'id'>),
      }));

      const futureRides = rides.filter((ride) =>
        dayjs(`${ride.date} ${ride.time}`).isAfter(dayjs())
      );
      const sorted = futureRides.sort((a, b) =>
        dayjs(`${a.date} ${a.time}`).diff(dayjs(`${b.date} ${b.time}`))
      );
      setMyRide(sorted[0] || null);
      setLoading(false);
    });

    return () => unsub();
  }, [currentUser]);

  const handleJoinRide = async (rideId: string) => {
    if (!currentUser) return;
    const rideRef = doc(firestore, 'rides', rideId);
    await updateDoc(rideRef, {
      passengers: arrayUnion(currentUser.uid),
      availableSeats: (myRide?.availableSeats || 1) - 1,
    });
  };

  const handleCancelRide = async (rideId: string) => {
    if (!currentUser) return;
    const rideRef = doc(firestore, 'rides', rideId);
    await updateDoc(rideRef, {
      passengers: arrayRemove(currentUser.uid),
      availableSeats: (myRide?.availableSeats || 0) + 1,
    });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      {/* Top Section */}
      <View style={{ padding: 24, paddingTop: 48 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937' }}>TUK Car-pool</Text>
        <Text style={{ fontSize: 16, color: '#6b7280', marginBottom: 16 }}>
          Ride Smart, Save More.
        </Text>

        {myRide ? (
          <RideCard
            ride={myRide}
            onJoin={() => handleJoinRide(myRide.id)}
            onCancel={() => handleCancelRide(myRide.id)}
          />
        ) : (
          <Text style={{ fontSize: 14, color: '#9ca3af', marginTop: 16 }}>
            No upcoming ride found.
          </Text>
        )}
      </View>

      {/* Map Section */}
      <View
        style={{
          flex: 1,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          overflow: 'hidden',
        }}
      >
        <UniversalMap />
      </View>
    </View>
  );
}
// This is the main dashboard screen that displays the user's rides and a map.
// It fetches the user's rides from Firestore and displays them in a card format.
// The user can join or cancel rides, and the map shows their current location.
// The screen also handles loading states and displays a message if no rides are found.