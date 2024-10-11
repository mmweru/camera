import { FlashMode } from "expo-camera";
import { View } from "react-native";
import IconButton from "./IconButton";

interface CameraToolsProps {
    cameraZoom: number;
    cameraFlash: FlashMode;
    cameraTorch: boolean;
    setCameraZoom: React.Dispatch<React.SetStateAction<number>>;
    setCameraFacing: React.Dispatch<React.SetStateAction<"front" | "back">>;
    setCameraTorch: React.Dispatch<React.SetStateAction<boolean>>;
    setCameraFlash: React.Dispatch<React.SetStateAction<FlashMode>>;
}

export default function CameraTools({
    cameraZoom,
    cameraFlash,
    cameraTorch,
    setCameraZoom,
    setCameraFacing,
    setCameraTorch,
    setCameraFlash,
}: CameraToolsProps) {
    return (
        <View
            style={{
                position: 'absolute',
                right: 6,
                gap: 16,
                zIndex: 1,
                marginTop: 25,
                paddingRight: 10,
            }}
        >
            <IconButton
                iosName={cameraTorch ? "flashlight.off.circle" : "flashlight.slash.circle"}
                androidName={cameraTorch ? "flashlight" : "flashlight-outline"}
                onPress={() => setCameraTorch((prevValue) => !prevValue)}
            />
            <IconButton
                iosName={"arrow.triangle.2.circlepath.camera"}
                androidName="camera-reverse-outline"
                width={25}
                height={21}
                onPress={() => setCameraFacing((prevValue) => prevValue === "back" ? "front" : "back")}
            />
            <IconButton
                iosName={cameraFlash === "on" ? "bolt.circle" : "bolt.slash.circle"}
                androidName={cameraFlash == "on" ? "flash" : "flash-off"}
                onPress={() => setCameraFlash((prevValue) => (prevValue === "off" ? "on" : "off"))}
            />
            <IconButton
                iosName={"speaker"}
                androidName="volume-high"
                onPress={() => { }}
            />
            
        </View>
    );
}
