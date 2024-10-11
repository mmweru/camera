import { Image, StyleSheet, Platform, Button, Alert } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { usePermissions } from 'expo-media-library';
import { useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function OnboardingScreen() {
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
    const [mediaLibraryPermission, requestMediaPermission] = usePermissions();

    async function handleContinue() {
        const allPermissions = await requestAllPermissions();
        if (allPermissions) {
            router.replace("/(tabs)")
        } else {
            Alert.alert("To continue please provide permissions in settings");
        }
    }

    async function requestAllPermissions() {
        const cameraStatus = await requestCameraPermission();
        if (!cameraStatus.granted) {
            Alert.alert("Error", "Camera Permissions is required")
            return false;
        }
        const microphoneStatus = await requestMicrophonePermission();
        if (!microphoneStatus.granted) {
            Alert.alert("Error", "Microphone Permissions is required")
            return false;
        }
        const mediaLibraryStatus = await requestMediaPermission();
        if (!mediaLibraryStatus.granted) {
            Alert.alert("Error", "Media Library Permissions is required")
            return false;
        }
        await AsyncStorage.setItem("hasOpened", "true");
        return true;
    }

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={

                <Image
                    source={require('@/assets/images/camera.jpeg')}
                    style={styles.reactLogo}
                />
            }>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Digital Camera</ThemedText>
                <HelloWave />
            </ThemedView>
            <ThemedText>
                Hey there! 😊 To make the most of this app, we'll need a few permissions from you:
            </ThemedText>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Camera Access</ThemedText>
                <ThemedText>
                    ***Snap those perfect pics...Capture every moment! 📸✨***
                </ThemedText>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Microphone Access</ThemedText>
                <ThemedText>
                    ***Add sound to your videos...Let’s record those memories! 🎤🎥***
                </ThemedText>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Media Library Access</ThemedText>
                <ThemedText>
                    ***Save & relive your favorite snaps...Cherish the memories! 🤳💾***
                </ThemedText>
            </ThemedView>

            <Button title="Continue" onPress={handleContinue} />
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 250,
        width: 386,
        bottom: 0,
        left: 0,
        position: 'relative',

    },
});
