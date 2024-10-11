import { CameraMode } from "expo-camera";
import { SymbolView } from "expo-symbols";
import { Image } from "expo-image";
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { Asset, getAlbumsAsync, getAssetsAsync } from "expo-media-library";



interface MainRowActionsProps {
    handleTakePicture: () => void;
    cameraMode: CameraMode;
    isRecording: boolean;
}
export default function MainRowActions({
    cameraMode,
    handleTakePicture,
    isRecording
}: MainRowActionsProps) {
    const [assets, setAssets] = useState<Asset[]>([]);

    useEffect(
        () => {
            getAlbums();
        }, []
    )
    async function getAlbums() {
        const albumAssets = await getAssetsAsync({
            mediaType: "photo",
            sortBy: "creationTime",
            first: 4,
        });
        setAssets(albumAssets.assets)
    }
    return (
        <View style={styles.container}>
            <FlatList
                data={assets}
                inverted
                renderItem={({ item }) => (
                    <Image
                        key={item.id}
                        source={item.uri}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 5,
                        }}
                    />
                )}
                horizontal
                contentContainerStyle={{ gap: 6 }}
            />
            <TouchableOpacity onPress={handleTakePicture}>
                <SymbolView
                    name={
                        cameraMode === "picture" ? "circle" : isRecording ? "record.circle" : "circle.circle"
                    }
                    size={90}
                    type="hierarchical"
                    tintColor={isRecording ? Colors.light.snapPrimary : "white"}
                    animationSpec={{
                        effect: {
                            type: isRecording ? "pulse" : "bounce"
                        },
                        repeating: isRecording
                    }}
                    fallback={
                        <MaterialIcons
                            size={90}
                            name={isRecording ? "circle" : "camera"} // Choose a relevant fallback icon for Android
                            color={isRecording ? Colors.light.snapPrimary : "white"} // Keep the color consistent
                        />
                    }
                />
            </TouchableOpacity>
            <ScrollView horizontal
                contentContainerStyle={{ gap: 8 }}
                showsHorizontalScrollIndicator={false}>
                {[0, 1, 2, 3].map(item =>
                    <SymbolView
                        key={item}
                        name="face.dashed"  // Main icon
                        size={35}
                        type="hierarchical"
                        tintColor={"white"}
                        fallback={
                            <FontAwesome
                                name="smile-o"  // Fallback icon representing a smiling face with options
                                size={35}
                                color={"white"}
                            />
                        }
                    />)}
            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    iconContainer: {
        position: 'relative',
        width: 90,
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
    },
    outline: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    container: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: 45,
        height: 100,
    }
});