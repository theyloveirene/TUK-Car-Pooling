import { Slot, Redirect } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../firebase-config';
import React, { useEffect, useState } from 'react';
import GlobalFAB from '../../components/GlobalFAB';

export default function TabsLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) return null;
  if (!user) return <Redirect href="/screens/Auth/Login" />;

  return (
    <>
      <GlobalFAB />
      <Slot />
    </>
  );
}
