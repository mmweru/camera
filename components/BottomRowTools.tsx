import { StyleSheet, TouchableOpacity, View } from "react-native";
import IconButton from "./IconButton";
import { Link } from "expo-router";
import { ThemedText } from "./ThemedText";
import { CameraMode } from "expo-camera";

interface BottomRowToolsProps {
    cameraMode: CameraMode;
    setCameraMode: React.Dispatch<React.SetStateAction<CameraMode>>;
}
export default function BottomRowTools({ cameraMode, setCameraMode }: BottomRowToolsProps) {
    return (
        <View style={[styles.bottomContainer, styles.directionRowItemsCenter]} >
            <Link href={"/medial-library"} asChild>
                <IconButton
                    androidName="images"  // Use a folder icon for Android
                    iosName="photo.stack" // Use a similar folder icon for iOS
                    onPress={() => { }}
                />
            </Link>
            <View style={styles.directionRowItemsCenter}>
                <TouchableOpacity onPress={() => setCameraMode("picture")}>
                    <ThemedText style={{
                        fontWeight: cameraMode === "picture" ? "bold" : "100",
                    }}>Snap</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCameraMode("video")}>
                    <ThemedText style={{
                        fontWeight: cameraMode === "video" ? "bold" : "100",
                    }}>Video</ThemedText>
                </TouchableOpacity>
            </View>
            <IconButton androidName="search-outline" iosName="magnifyingglass" />

        </View>
    )
}
const styles = StyleSheet.create({
    directionRowItemsCenter: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    bottomContainer: {
        width: "100%",
        justifyContent: "space-between",
        position: "absolute",
        alignSelf: "center",
        bottom: 6
    }
})
