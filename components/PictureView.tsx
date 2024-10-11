import { Image as ExpoImage } from 'expo-image';
import * as React from 'react';
import { Alert, View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Text } from "react-native";
import IconButton from './IconButton'; // Ensure IconButton component is implemented correctly
import { saveToLibraryAsync } from 'expo-media-library';
import { shareAsync } from 'expo-sharing';
import * as ImagePicker from 'expo-image-picker';
import { Canvas, Image as SkiaImage, ColorMatrix, useImage } from "@shopify/react-native-skia";
import { useState, useRef } from 'react';
import { captureRef } from 'react-native-view-shot'; // Import view-shot
import * as ScreenOrientation from 'expo-screen-orientation';


const { width, height } = Dimensions.get("window");

// Color matrices for filters
// Color matrices for filters
const COLOUR_MATRIX = {
    original: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],

    santorini: [
        0.5, 0.5, 0, 0, 0,
        0.3, 0.4, 0.2, 0, 0,
        0.2, 0.3, 0.4, 0, 0,
        0, 0, 0, 1, 0
    ], // Adds a cool-toned filter, inspired by Santorini’s blue hues

    brightness: [
        1.2, 0, 0, 0, 0,
        0, 1.2, 0, 0, 0,
        0, 0, 1.2, 0, 0,
        0, 0, 0, 1, 0
    ], // Slight increase in brightness

    sepia: [
        0.393, 0.769, 0.189, 0, 0,
        0.349, 0.686, 0.168, 0, 0,
        0.272, 0.534, 0.131, 0, 0,
        0, 0, 0, 1, 0
    ], // Classic sepia effect for a vintage look

    grayscale: [
        0.33, 0.33, 0.33, 0, 0,
        0.33, 0.33, 0.33, 0, 0,
        0.33, 0.33, 0.33, 0, 0,
        0, 0, 0, 1, 0
    ], // Converts image to grayscale by averaging the RGB channels

    invert: [-1, 0, 0, 0, 1, 0, -1, 0, 0, 1, 0, 0, -1, 0, 1, 0, 0, 0, 1, 0], // Inverts colors

    contrast: [
        1.5, 0, 0, 0, -0.5,
        0, 1.5, 0, 0, -0.5,
        0, 0, 1.5, 0, -0.5,
        0, 0, 0, 1, 0
    ], // Increase contrast

    hueRotate: [
        0.213, 0.715, 0.072, 0, 0,
        0.213, 0.715, 0.072, 0, 0,
        0.213, 0.715, 0.072, 0, 0,
        0, 0, 0, 1, 0
    ], // Rotates the hue of the colors

    saturation: [
        1.5, -0.3, -0.3, 0, 0,
        -0.3, 1.5, -0.3, 0, 0,
        -0.3, -0.3, 1.5, 0, 0,
        0, 0, 0, 1, 0
    ], // Boosts saturation for more vibrant colors

    warmFilter: [
        1.2, 0.1, 0, 0, 0,
        0.2, 1.0, 0, 0, 0,
        0, 0.1, 1.3, 0, 0,
        0, 0, 0, 1, 0
    ], // Adds a warm filter for a cozy, warm tone

    // New entries:

    brightBoost: [
        1.5, 0, 0, 0, 0,
        0, 1.5, 0, 0, 0,
        0, 0, 1.5, 0, 0,
        0, 0, 0, 1, 0
    ], // Strong brightness increase

    ultraBright: [
        2, 0, 0, 0, 0,
        0, 2, 0, 0, 0,
        0, 0, 2, 0, 0,
        0, 0, 0, 1, 0
    ], // Extreme brightness, good for creating overexposed effect

    pencilArt: [
        0.3, 0.59, 0.11, 0, 0,
        0.3, 0.59, 0.11, 0, 0,
        0.3, 0.59, 0.11, 0, 0,
        0, 0, 0, 1, 0
    ], // Mimics a pencil sketch by emphasizing grayscale with higher contrast and edge detection
    faceSmoothing: [      
    3.190, -1.360, -0.137,  0.000, -0.170, 
    -0.404,  2.240, -0.137,  0.000, -0.170, 
    -0.404, -1.360,  3.460,  0.000, -0.170, 
    0.000,  0.000,  0.000,  1.000,  0.000
    ], // Example for smoothing
    backgroundBlur: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0.5, 0], // Example for blurring
    lighten: [
               3.180, -1.170, -0.051,  0.000, -0.077, 
              -0.316,  2.130, -0.082,  0.000, -0.077,
              -0.431, -1.530,  3.290,  0.000, -0.077, 
               0.000,  0.000,  0.000,  1.000,  0.000
    ], // Example for lightening
    darken: [0.8, 0, 0, 0, 0, 0, 0.8, 0, 0, 0, 0, 0, 0.8, 0, 0, 0, 0, 0, 1, 0], // Example for darkening
    water: [
         1.180, -0.161, -0.016,  0.000, -0.343,
         -0.048,  1.070, -0.016,  0.000, -0.343, 
         -0.048, -0.161,  1.210,  0.000, -0.343, 
         0.000,  0.000, 0.000,  1.000,  0.000    
    ], // Adds a bright, crayon-like color saturation effect

    dim: [
        0.5, 0, 0, 0, 0,
        0, 0.5, 0, 0, 0,
        0, 0, 0.5, 0, 0,
        0, 0, 0, 1, 0
    ], // Reduces brightness for a dimmed effect

    // New sketch effect
    dark: [
        0.5, 0.5, 0, 0, 0,
        0.5, 0.5, 0, 0, 0,
        0.5, 0.5, 0, 0, 0,
        0, 0, 0, 1, 0,
    ], // Original sketch effect

    invertedSketch: [
        0.8, 0.2, 0.2, 0, 0, // Red channel inverted
        0.2, 0.8, 0.2, 0, 0, // Green channel inverted
        0.2, 0.2, 0.8, 0, 0, // Blue channel inverted
        0, 0, 0, 1, 0       // Alpha channel unchanged
    ], // More 
    Art: [
       0.402, 0.985, 0.143, 0.000, -0.347,
       0.357, 1.030, 0.142, 0.000, -0.347,
       0.356, 0.981, 0.186, 0.000, -0.347,
       0.000, 0.000, 0.000, 1.000,  0.000
       
    ],

    watercolor: [
        0.9, 0.1, 0.1, 0, 0,
        0.1, 0.9, 0.1, 0, 0,
        0.1, 0.1, 0.9, 0, 0,
        0, 0, 0, 1, 0
    ], // Softens colors to give a watercolor effect

    crayonEffect: [
       -2.230, 2.330,  0.906,  0.000, -0.344, 
        0.933,-0.024,  0.092,  0.000, -0.343, 
        0.308, 3.290, -2.600,  0.000, -0.344, 
        0.000, 0.000,  0.000,  1.000,  0.000 
    ],

    comicBook: [
       1.350,  4.550, -3.990,  0.000, -0.435, 
       -0.242,  0.622,  1.400,  0.000, -0.436, 
       3.940, -1.870, -0.209,  0.000, -0.435,
       0.000,  0.000,  0.000,  1.000,  0.000
    ], // Emphasizes bright colors and high contrast, simulating a comic book style

    neonGlow: [
        1.5, 0, 0, 0, 0,
        0, 1.5, 0, 0, 0,
        0, 0, 1.5, 0, 0,
        0, 0, 0, 1, 0
    ], // Creates a bright, glowing effect similar to neon colors

    pastel: [
        0.8, 0, 0, 0, 0,
        0, 0.8, 0, 0, 0,
        0, 0, 0.8, 0, 0,
        0, 0, 0, 1, 0
    ], // Softens the colors for a pastel effect

    oilPaint: [
        0.5, 0.5, 0.5, 0, 0,
        0.5, 0.5, 0.5, 0, 0,
        0.5, 0.5, 0.5, 0, 0,
        0, 0, 0, 1, 0
    ], // Creates an oil painting effect by blending colors
};

interface PictureViewProps {
    picture: string;
    setPicture: React.Dispatch<React.SetStateAction<string>>;

}

export default function PictureView({ picture, setPicture}: PictureViewProps) {
    const [imageUri, setImage] = useState<string | null>(picture);
    const [matrix, setMatrix] = useState<number[]>(COLOUR_MATRIX.original);
    const canvasRef = useRef<any>(null); // Reference for the canvas

    // Load image using Skia's useImage hook
    const skiaImage = useImage(imageUri || '');

    // Open gallery to pick an image
    const openGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        }
    };

    // Apply selected filter
    const applyFilter = (filterMatrix: number[]) => {
        setMatrix(filterMatrix);
    };

    // Save the current displayed image
    const saveImage = async () => {
        try {
            const uri = await captureRef(canvasRef, {
                format: 'png',
                quality: 1,
            });
            await saveToLibraryAsync(uri);
            Alert.alert("Picture saved!");
        } catch (error) {
            Alert.alert("Error saving picture", (error as any).message);
        }
    };

    // Share the current displayed image
    const shareImage = async () => {
        try {
            const uri = await captureRef(canvasRef, {
                format: 'png',
                quality: 1,
            });
            await shareAsync(uri);
        } catch (error) {
            Alert.alert("Error sharing picture", (error as any).message);
        }
    };

    return (
        <View style={styles.container}>
            {/* Save, Share, and Gallery Icon Buttons */}
            <View style={styles.iconContainer}>
                <IconButton
                    iosName="arrow.down"
                    androidName="arrow-down"
                    onPress={saveImage} // Updated to use saveImage function
                />
                <IconButton
                    iosName="doc.text.image"
                    androidName="image-outline"
                    onPress={openGallery}
                />
                <IconButton
                    iosName="square.and.arrow.up"
                    androidName="arrow-redo"
                    onPress={shareImage} // Updated to use shareImage function
                />
            </View>

            {/* Render selected image with Skia filter */}
            {skiaImage && (
                <Canvas ref={canvasRef} style={styles.canvas}>
                    <SkiaImage x={0} y={0} width={width} height={height - 120} image={skiaImage}>
                        <ColorMatrix matrix={matrix} />
                    </SkiaImage>
                </Canvas>
            )}

            {/* Filter Selection Carousel */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterCarouselContent}
            >
                {Object.keys(COLOUR_MATRIX).map((filterName, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => applyFilter(COLOUR_MATRIX[filterName as keyof typeof COLOUR_MATRIX])}
                        style={styles.filterCard}
                    >
                        <Canvas style={styles.filterCanvas}>
                            <SkiaImage x={0} y={0} width={width / 4} height={height / 4} image={skiaImage}>
                                <ColorMatrix matrix={COLOUR_MATRIX[filterName as keyof typeof COLOUR_MATRIX]} />
                            </SkiaImage>
                        </Canvas>
                        <View style={styles.filterLabelContainer}>

                            <Text style={styles.filterLabel}>{filterName}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>


            {/* Close Button */}
            <View style={styles.closeIcon}>
                <IconButton onPress={() => setPicture('')} iosName="xmark" androidName="close" />
            </View>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    iconContainer: {
        position: 'absolute',
        right: 6,
        zIndex: 1,
        paddingTop: 65,
        gap: 16,
    },
    canvas: {
        width,
        height: height - 165,
    },
    closeIcon: {
        position: "absolute",
        zIndex: 1,
        paddingTop: 55,
        paddingLeft: 6,
    },
    filterCarouselContent: {
        flexDirection: 'row',
        paddingBottom: 90, // Space below the cards
    },
    filterCard: {
        marginRight: 10,
        width: width / 4,
        height: height / 6,
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
    },
    filterCanvas: {
        width: '100%',
        height: '100%',
    },
    filterLabelContainer: {
        position: 'absolute',
        bottom: 5,
        left: 5,
        right: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 5,
        padding: 5,
        paddingBottom: 20,

    },
    filterLabel: {
        color: '#fff',
        textAlign: 'center',
    },
});