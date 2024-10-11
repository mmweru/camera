import React, { useState, useRef, useEffect } from "react";
import { Alert, View } from "react-native";
import { shareAsync } from "expo-sharing";
import { saveToLibraryAsync } from "expo-media-library";
import { Video } from "expo-av";
import { RNCamera } from "react-native-camera";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import IconButton from "./IconButton"; // Assuming you have this component
import * as Brightness from "expo-brightness";
import { Waveform, type IWaveformRef } from "@simform_solutions/react-native-audio-waveform"; // Import Waveform

interface VideoViewProps {
    video: string;
    setVideo: React.Dispatch<React.SetStateAction<string>>;
    exposure: number;
}

export default function VideoViewComponent({ video, setVideo, exposure }: VideoViewProps) {
    const [isPlaying, setIsPlaying] = useState(true);
    const [zoomLevel, setZoomLevel] = useState(0);
    const [flashOn, setFlashOn] = useState(false);
    const [recording, setRecording] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);

    const cameraRef = useRef<RNCamera>(null);
    const videoRef = useRef<Video>(null);
    const waveformRef = useRef<IWaveformRef>(null); // Waveform ref

  

    //useEffect(() => {
    //    const adjustBrightness = async () => {
    //        await Brightness.setBrightnessAsync(1); // Max brightness during recording
    //    };
    //    const resetBrightness = async () => {
    //        await Brightness.setBrightnessAsync(0.5); // Reset brightness after recording
    //    };
    //    adjustBrightness();
    //    return resetBrightness;
    //}, [recording]);

    const startRecording = async () => {
        if (cameraRef.current) {
            const options = { quality: RNCamera.Constants.VideoQuality["2160p"], maxDuration: 240 };
            const data = await cameraRef.current.recordAsync(options);
            setVideo(data.uri); // Save the recorded video URI
            Alert.alert("Video recorded!", `File saved: ${data.uri}`);
        }
    };

    const stopRecording = async () => {
        if (cameraRef.current) {
            await cameraRef.current.stopRecording();
            setRecording(false);
        }
    };

    const toggleRecording = async () => {
        if (recording) {
            await stopRecording();
        } else {
            setRecording(true);
            await startRecording();
        }
    };

    const toggleFlash = () => {
        setFlashOn(!flashOn);
        Alert.alert(flashOn ? "Flash off" : "Flash on");
    };

    return (
        <Animated.View layout={LinearTransition} entering={FadeIn} exiting={FadeOut}>
            <View style={{ position: "absolute", right: 6, zIndex: 1, paddingTop: 100, gap: 16 }}>
                <IconButton onPress={() => setVideo("")} iosName={"xmark"} androidName="close" />
                <IconButton
                    onPress={async () => {
                        await saveToLibraryAsync(video);
                        Alert.alert("✅ Video saved!");
                    }}
                    iosName={"arrow.down"}
                    androidName="download"
                />
                <IconButton
                    onPress={async () => await shareAsync(video)}
                    iosName={"square.and.arrow.up"}
                    androidName="share"
                />
                <IconButton
                    iosName={recording ? "stop" : "record.circle"}
                    androidName={recording ? "recording" : "recording-outline"}
                    onPress={toggleRecording}
                />
                <IconButton
                    onPress={toggleFlash}
                    iosName={flashOn ? "bolt.fill" : "bolt.slash.fill"}
                    androidName={flashOn ? "flash" : "flash-off"}
                />
            </View>

            {/* Video Playback Component */}
            <Video
                ref={videoRef}
                source={{ uri: video }} // Video URI
                style={{ width: "100%", height: "100%" }} // Fullscreen video
                useNativeControls={true} // Display controls
                shouldPlay={isPlaying}
                onPlaybackStatusUpdate={(status) => {
                    if (status.isLoaded) {
                        setIsPlaying(status.isPlaying);
                        if (status.positionMillis >= (status.durationMillis || 0)) {
                            setIsPlaying(false);
                        }
                    }
                }}
            />

            {/* Waveform for the audio in the video */}
            {video && (
                <Waveform
                    mode="static"
                    ref={waveformRef}
                    path={video} // Assuming the waveform supports video with audio or use extracted audio
                    candleSpace={2}
                    candleWidth={4}
                    scrubColor="white"
                    onPlayerStateChange={(playerState) => console.log(playerState)}
                    onPanStateChange={(isMoving) => console.log(isMoving)}
                />
            )}

            <RNCamera
                ref={cameraRef}
                style={{ flex: 1 }}
                type={RNCamera.Constants.Type.back}
                flashMode={flashOn ? RNCamera.Constants.FlashMode.on : RNCamera.Constants.FlashMode.off}
                zoom={zoomLevel}
                captureAudio={true} // Capture audio during recording
                whiteBalance={RNCamera.Constants.WhiteBalance.auto}
            />
        </Animated.View>
    );
}
