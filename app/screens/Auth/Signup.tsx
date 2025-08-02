import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { ToggleButton } from 'react-native-paper';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../../../firebase-config';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type SignupForm = {
  name: string;
  email: string;
  password: string;
  role: 'driver' | 'student';
  hostel: string;
};

const SignupScreen: React.FC = () => {
  const router = useRouter();
  const [form, setForm] = useState<SignupForm>({
    name: '',
    email: '',
    password: '',
    role: 'student',
    hostel: 'TUK Men',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = useCallback(
    (key: keyof SignupForm, value: string) => {
      setForm(prev => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleSignup = useCallback(async () => {
    const { name, email, password, role, hostel } = form;
    if (!name || !email || !password || !role) {
      Alert.alert('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(firestore, 'users', user.uid), {
        uid: user.uid,
        name,
        email,
        role,
        hostel,
        idVerified: false,
      });
      Alert.alert('Signup successful');
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Signup failed', error.message);
    } finally {
      setLoading(false);
    }
  }, [form, router]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      {/* Name Field */}
      <TextInput
        placeholder="Full Name"
        value={form.name}
        onChangeText={text => handleChange('name', text)}
        autoCapitalize="words"
        style={styles.input}
      />

      {/* Email Field */}
      <TextInput
        placeholder="Email"
        value={form.email}
        onChangeText={text => handleChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      {/* Password Field with Toggle */}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={form.password}
          onChangeText={text => handleChange('password', text)}
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
        />
        <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      {/* Role Selection Toggle */}
      <Text style={styles.label}>Select your role:</Text>
      <View style={styles.toggleContainer}>
        <ToggleButton.Row
          onValueChange={value => handleChange('role', value)}
          value={form.role}
        >
          <ToggleButton icon="account" value="student" />
          <ToggleButton icon="car" value="driver" />
        </ToggleButton.Row>
      </View>    

      {/* Hostel Field - Only for Students */}
      {form.role === 'student' && (
        <TextInput
          placeholder="Hostel"
          value={form.hostel}
          onChangeText={text => handleChange('hostel', text)}
          style={styles.input}
        />
      )}

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.signupButton, loading && styles.disabledButton]}
        disabled={loading}
        onPress={handleSignup}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      {/* Login Link */}
      <TouchableOpacity onPress={() => router.push('./Login')}>
        <Text style={styles.linkText}>
          Already have an account? Log In
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e293b',
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
  },
  label: {
    color: '#374151',
    fontWeight: '500',
    marginBottom: 8,
  },
  toggleContainer: {
    marginBottom: 16,
  },
  signupButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
  linkText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#2563eb',
    marginTop: 24,
    fontWeight: '500',
  },
});

export default SignupScreen;