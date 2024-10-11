import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import { curveLines } from "react-native-redash";
import { Video } from 'expo-av'; // Import Video component

import Picture from "./Picture";
import Controls from "./Controls";
import Cursor from "./Cursor";
import { HEIGHT, WIDTH, PADDING } from "./Constants";
import { point } from "@shopify/react-native-skia";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        justifyContent: "space-evenly",
    },
    cursors: {
        ...StyleSheet.absoluteFillObject,
        left: PADDING / 2,
        right: PADDING / 2,
        flexDirection: "row",
        justifyContent: "space-between",
    },
});

const Darkroom = ({ imageUri }: { imageUri: string }) => {
    const v1 = useSharedValue(1);
    const v2 = useSharedValue(0.75);
    const v3 = useSharedValue(0.5);
    const v4 = useSharedValue(0.25);
    const v5 = useSharedValue(0);
    const points = [v1, v2, v3, v4, v5];
    const STEP = WIDTH / 4;
    const path = useDerivedValue(() =>
        curveLines(points.map((point, i) => ({
            x: PADDING + i * STEP,
            y: point.value * HEIGHT
        })), 0.1, "complex"));

    return (
        <SafeAreaView style={styles.container}>
            {/* Pass the imageUri prop to Picture */}

            <Picture path={path} source={{ uri: imageUri }} />
            <View>
                <Controls path={path} />
                <View style={styles.cursors}>
                    <Cursor value={v1} />
                    <Cursor value={v2} />
                    <Cursor value={v3} />
                    <Cursor value={v4} />
                    <Cursor value={v5} />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Darkroom;