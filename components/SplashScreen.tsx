// components/SplashScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function SplashScreen() {
  const rotation = useSharedValue(0);
  const skidOffset = useSharedValue(0);
  const smokeOpacity = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1200,
        easing: Easing.linear,
      }),
      -1
    );

    skidOffset.value = withRepeat(
      withTiming(15, { duration: 300, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    smokeOpacity.value = withRepeat(
      withTiming(0.8, { duration: 600, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const wheelStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { translateX: skidOffset.value },
      ] as const, // Mark the transform array as const
    };
  });

  const smokeStyle = useAnimatedStyle(() => {
    return {
      opacity: smokeOpacity.value,
      transform: [
        { 
          scale: interpolate(
            smokeOpacity.value, 
            [0, 0.8], 
            [0.8, 1.2],
            Extrapolate.CLAMP
          ) 
        }
      ] as const,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../assets/images/sport-car.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>TUK Car-pool</Text>
        <Text style={styles.slogan}>Ride Smart, Save More.</Text>

        <AnimatedImage
          source={require('../assets/images/tire.png')}
          style={[styles.wheel, wheelStyle]}
          resizeMode="contain"
        />

        <Animated.View style={[styles.smoke, smokeStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 10,
  },
  slogan: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 30,
  },
  wheel: {
    width: 40,
    height: 40,
    position: 'absolute',
  },
  smoke: {
    position: 'absolute',
    bottom: 80,
    width: 60,
    height: 30,
    backgroundColor: '#D1D5DB',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: -1,
  },
});