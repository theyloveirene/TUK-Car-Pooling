import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase-config';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [hostel, setHostel] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const user = getAuth().currentUser;

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const docRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setHostel(data.hostel || '');
          setEmail(data.email || '');
          setRole(data.role || '');
        } else {
          Alert.alert('Error', 'Profile data not found.');
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
        Alert.alert('Error', 'Failed to fetch user profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const docRef = doc(firestore, 'users', user.uid);
      await updateDoc(docRef, {
        name,
        hostel,
      });
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B5563" />
      </View>
    );
  }

  const goToHome = () => {
    router.push('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      {role === 'student' && (
        <>
          <Text style={styles.label}>Hostel</Text>
          <TextInput
            value={hostel}
            onChangeText={setHostel}
            style={styles.input}
          />
        </>
      )}

      <Text style={styles.label}>Email</Text>
      <Text style={styles.emailText}>{email}</Text>

      <Text style={styles.label}>Role</Text>
      <Text style={styles.roleText}>{role}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={goToHome}
          style={styles.homeButton}
        >
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          style={[styles.saveButton, saving && styles.disabledButton]}
        >
          <Text style={styles.buttonText}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  emailText: {
    color: '#6b7280',
    marginBottom: 16,
  },
  roleText: {
    color: '#6b7280',
    marginBottom: 24,
    textTransform: 'capitalize',
  },
  buttonContainer: {
    marginTop: 16,
  },
  homeButton: {
    backgroundColor: '#16a34a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});