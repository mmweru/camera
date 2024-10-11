import * as React from 'react';
import { StyleSheet, Platform, View, SafeAreaView, TouchableOpacity, Text, Modal, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { BarcodeScanningResult, Camera, CameraMode, CameraView, FlashMode } from 'expo-camera';
import * as WebBrowser from 'expo-web-browser';
import IconButton from '../../components/IconButton';
import BottomRowTools from '../../components/BottomRowTools';
import MainRowActions from '../../components/MainRowActions';
import QRCodeButton from '../../components/QRCodeButton';
import * as ScreenOrientation from 'expo-screen-orientation'; // Import ScreenOrientation API
import { useRef, useState } from 'react';
import CameraTools from '../../components/CameraTools';
import VideoViewComponent from '@/components/VideoView';
import ExposureControls from "@/components/ExposureControls";
import ZoomControls from "@/components/ZoomControls";
import Darkroom from "../../components/Darkroom";
import { useNavigation } from '@react-navigation/native';
import PictureView from '../../components/PictureView';
import { PinchGestureHandler, State, PinchGestureHandlerEventPayload, GestureEvent, GestureHandlerStateChangeEvent } from 'react-native-gesture-handler';


export default function HomeScreen() {
    const cameraRef = useRef<CameraView>(null);
    const [cameraMode, setCameraMode] = React.useState<CameraMode>("picture");
    const [qrCodeDetected, setQrCodeDetected] = React.useState<string>("");
    const [isBrowsing, setIsBrowsing] = React.useState<boolean>(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [cameraZoom, setCameraZoom] = React.useState<number>(0);
    const [cameraTorch, setCameraTorch] = React.useState<boolean>(false);
    const [cameraFlash, setCameraFlash] = React.useState<FlashMode>("off");
    const [cameraFacing, setCameraFacing] = React.useState<"front" | "back">("back");
    const [picture, setPicture] = useState<string>(""); // Updated to null for initial state
    const [video, setVideo] = React.useState<string>(""); // For handling video
    const [isRecording, setIsRecording] = React.useState<boolean>(false); // For recording state
    const [showZoomControls, setShowZoomControls] = React.useState(false);
    const [showExposureControls, setShowExposureControls] = React.useState(false);
    const [zoom, setZoom] = React.useState(0);
    const [exposure, setExposure] = React.useState<number>(100); // State to manage exposure level
    const [timerDuration, setTimerDuration] = useState<number | null>(null); // Selected timer duration
    const [countdown, setCountdown] = useState<number | null>(null); // Countdown state
    const [isCountdownActive, setIsCountdownActive] = useState<boolean>(false); // Countdown state
    const [dropdownVisible, setDropdownVisible] = useState<boolean>(false); // Dropdown visibility
    const timerOptions = [3, 5, 10]; // Countdown options
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait'); // New state for orientation
    const navigation = useNavigation(); // Use navigation to go to Darkroom
    // In your HomeScreen component
    const handlePinchGestureEvent = (event: GestureEvent<PinchGestureHandlerEventPayload>) => {
        const { scale } = event.nativeEvent; // Accessing scale from the native event
        setZoom(scale); // Update zoom state with pinch scale
    };
    const [isLivePhoto, setIsLivePhoto] = useState<boolean>(false); // New state for live photo mode
    // Function to toggle orientation
    //const toggleOrientation = async () => {
    //    if (orientation === 'portrait') {
    //        // Switch to landscape
    //        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    //        setOrientation('landscape');
    //    } else {
    //        // Switch to portrait
    //        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    //        setOrientation('portrait');
    //    }
    //};


    // Function to toggle video recording
    async function toggleRecord() {
        if (isRecording) {
            // Stop recording
            cameraRef.current?.stopRecording();
            setIsRecording(false);
        } else {
            // Start recording
            setIsRecording(true);
            const response = await cameraRef.current?.recordAsync();
            if (response) {
                setVideo(response.uri); // Store video URI when recording finishes
            }
        }
    }

    // Function to take a picture
    async function handleTakePicture() {
        const response = await cameraRef.current?.takePictureAsync({});


        if (response) {
            setPicture(response.uri);
            // Set orientation based on camera view aspect ratio (example logic)
        }
    }
    const onPinchStateChange = (event: GestureEvent<PinchGestureHandlerEventPayload>) => {
        // Handle the state change here
        console.log(event.nativeEvent.state);
    };

    // Function to start countdown
    const startCountdown = (duration: number) => {
        setTimerDuration(duration);
        setIsCountdownActive(true);
        setCountdown(duration);

        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    clearInterval(interval);
                    handleTakePicture(); // Take picture when countdown reaches 0
                    setIsCountdownActive(false); // Reset countdown state
                    return null; // Reset countdown
                }
                return prev ? prev - 1 : prev;
            });
        }, 1000);
    };

    // Open QR Code in the browser
    async function handleOpenQRCode() {
        if (qrCodeDetected) {
            setIsBrowsing(true);
            const browserResult = await WebBrowser.openBrowserAsync(qrCodeDetected, {
                presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET
            });
            if (browserResult.type === "cancel") {
                setIsBrowsing(false);
            }
        }
    }

    // Handle barcode scanning
    function handleBarcodeScanned(scanningResult: BarcodeScanningResult) {
        if (scanningResult.data) {
            setQrCodeDetected(scanningResult.data);  // QR detected, set state
            // Clear timeout if it's already set, to reset the timer
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
             //Set a timeout to clear the QR code after 1 second
            timeoutRef.current = setTimeout(() => {
                setQrCodeDetected("");  // Clear the QR code after time limit
            }, 30); // Adjust time as needed (3 seconds here)
        } else {
            // If no QR code detected, clear the state immediately
            setQrCodeDetected("");
        }
    }

    // Handle screen states (browsing, picture, video)
    if (isBrowsing) return <></>; // If browsing, return nothing

    if (picture) {

        // Route to PictureView instead of Darkroom
        return <PictureView picture={picture} setPicture={setPicture} />;
    }
    //if (picture) {
    //    return <Darkroom imageUri={picture} />;     
    //}

    if (video) return <VideoViewComponent video={video} setVideo={setVideo} exposure={50} />; // Pass exposure to VideoViewComponent

    return (
        <View style={{ flex: 1 }}>
            <PinchGestureHandler onGestureEvent={handlePinchGestureEvent} onHandlerStateChange={onPinchStateChange}>
            <CameraView
                ref={cameraRef}
                mode={cameraMode}
                zoom={zoom}
                flash={cameraFlash}
                enableTorch={cameraTorch}
                facing={cameraFacing}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"]
                }}
                onBarcodeScanned={handleBarcodeScanned}
                style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>

                        {/* Display QRCode button if detected */}
                            {qrCodeDetected ? (
                                <QRCodeButton handleOpenQRCode={handleOpenQRCode} />
                            ) : null}

                        {/* Camera tools (zoom, torch, etc.) */}
                        <CameraTools
                            cameraZoom={cameraZoom}
                            cameraFlash={cameraFlash}
                            cameraTorch={cameraTorch}
                            setCameraZoom={setCameraZoom}
                            setCameraFacing={setCameraFacing}
                            setCameraTorch={setCameraTorch}
                            setCameraFlash={setCameraFlash}
                        />

                        {/* Timer Icon (⏱️) */}
                        <View style={styles.timerIconContainer}>
                            <TouchableOpacity
                                style={styles.timerIcon}
                                onPress={() => setDropdownVisible(!dropdownVisible)} // Toggle dropdown visibility
                            >
                                <Text style={styles.timerIconText}>⏱️</Text>
                            </TouchableOpacity>

                            {dropdownVisible && ( // Show dropdown options
                                <View style={styles.dropdown}>
                                    <FlatList
                                        data={timerOptions}
                                        keyExtractor={(item) => item.toString()}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={styles.dropdownItem}
                                                onPress={() => {
                                                    startCountdown(item);
                                                    setTimerDuration(item);
                                                    setDropdownVisible(false); // Hide dropdown after selection
                                                }}
                                            >
                                                <Text style={styles.dropdownText}>{item} seconds</Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            )}

                            {/* Countdown display in the center */}
                            {isCountdownActive && countdown !== null && (
                                <View style={styles.countdownOverlay}>
                                    <Text style={styles.countdownText}>{countdown}</Text>
                                </View>
                            )}
                        </View>

                        {/* Orientation Toggle Icon (Between timer and zoom icons) */}
                        {/*<View style={styles.orientationToggleContainer}>*/}
                        {/*    <TouchableOpacity*/}
                        {/*        style={styles.orientationToggleIcon}*/}
                        {/*        onPress={toggleOrientation}*/}
                        {/*    >*/}
                        {/*        <Text style={styles.orientationToggleText}>*/}
                        {/*            {orientation === 'portrait' ? '🔄' : '🔃'} */}{/* Same icon for both */}
                        {/*        </Text>*/}
                        {/*    </TouchableOpacity>*/}
                        {/*</View>*/}

                        <View style={styles.container}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => setShowZoomControls((s) => !s)}
                            >
                                <Text style={styles.buttonText}>+/-</Text>
                            </TouchableOpacity>
                        </View>

                        {showZoomControls ? (
                            <ZoomControls
                                setZoom={setZoom}
                                setShowZoomControls={setShowZoomControls}
                                zoom={zoom ?? 1}
                            />
                        ) : null}

                        <View style={{ flex: 1 }}></View>

                        <MainRowActions
                            cameraMode={cameraMode}
                            handleTakePicture={cameraMode === "picture" ? handleTakePicture : toggleRecord}
                            isRecording={isRecording} // Pass recording state to update UI
                        />

                        {/* Bottom tools to switch between picture and video modes */}
                        <BottomRowTools setCameraMode={setCameraMode} cameraMode={cameraMode} />
                    </View>
                </SafeAreaView>
                    </CameraView>
            </PinchGestureHandler>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 75,
    },
    button: {
        zIndex: 1,
        position: 'absolute', // Use absolute positioning
        bottom: 20, // Position it at the bottom of the screen, 20px from the bottom
        left: 20, // Position it on the left, 20px from the left side
        backgroundColor: 'rgba(128, 128, 128, 0.6)', // Translucent gray color
        padding: 10, // Padding for the button
        borderRadius: 5, // Rounded corners
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
    },
    timerIconContainer: {
        position: 'absolute',
        top: 50,
        left: 20,
    },
    orientationToggleContainer: {
        position: 'absolute',
        top: 230,
        right: 15, // Position to the right, between the timer and zoom icons
    },
    orientationToggleIcon: {
        borderRadius: 50,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
    },
    orientationToggleText: {
        fontSize: 25,
    },
    timerIcon: {
        borderRadius: 50,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
    },
    timerIconText: {
        fontSize: 30,
    },
    dropdown: {
        maxHeight: 150,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        elevation: 3,
    },
    dropdownItem: {
        padding: 3,
    },
    dropdownText: {
        fontSize: 16,
        color: '#000',
    },
    countdownOverlay: {
        position: 'absolute',
        top: '40%', // Center the countdown vertically
        left: 20,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    countdownText: {
        fontSize: 60, // Large font size for countdown
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});