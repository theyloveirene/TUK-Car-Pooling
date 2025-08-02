// app/(tabs)/rides/create.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
import { firestore, auth } from '../../../firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

const CreateRide = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [dateTime, setDateTime] = useState(new Date());
  const [seats, setSeats] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const router = useRouter();

  const handleCreateRide = async () => {
    if (!pickup || !destination || !seats) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to create a ride');
      return;
    }

    try {
      const date = dateTime.toISOString().split('T')[0];
      const timeFormatted = dateTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      await addDoc(collection(firestore, 'rides'), {
        driverId: currentUser.uid,
        pickup: pickup,
        destination: destination,
        date: date,
        time: timeFormatted,
        seats: parseInt(seats),
        passengers: [],
        status: "upcoming",
      });

      Alert.alert('Success', 'Ride created successfully!');
      router.push('/(tabs)');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const newDateTime = new Date(dateTime);
      newDateTime.setFullYear(selectedDate.getFullYear());
      newDateTime.setMonth(selectedDate.getMonth());
      newDateTime.setDate(selectedDate.getDate());
      setDateTime(newDateTime);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const newDateTime = new Date(dateTime);
      newDateTime.setHours(selectedTime.getHours());
      newDateTime.setMinutes(selectedTime.getMinutes());
      setDateTime(newDateTime);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create a Ride</Text>

      <TextInput
        style={styles.input}
        placeholder="Pickup Location (e.g., TUK Main Gate)"
        value={pickup}
        onChangeText={setPickup}
      />

      <TextInput
        style={styles.input}
        placeholder="Destination (e.g., CBD, Westlands)"
        value={destination}
        onChangeText={setDestination}
      />

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Select Date</Text>
        <TouchableOpacity 
          onPress={() => setShowDatePicker(true)}
          style={styles.pickerButton}
        >
          <Text style={styles.pickerText}>
            {dateTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Select Time</Text>
        <TouchableOpacity 
          onPress={() => setShowTimePicker(true)}
          style={styles.pickerButton}
        >
          <Text style={styles.pickerText}>
            {dateTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Number of Available Seats"
        value={seats}
        onChangeText={setSeats}
        keyboardType="numeric"
      />

      <TouchableOpacity
        onPress={handleCreateRide}
        style={styles.createButton}
      >
        <Text style={styles.buttonText}>Create Ride</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dateTime}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={dateTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onTimeChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e293b',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#f3f4f6',
  },
  pickerText: {
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default CreateRide;