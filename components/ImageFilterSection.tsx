import { View, Text, Dimensions, StyleSheet, TouchableOpacity, SafeAreaView, FlatList } from "react-native";
import { useState } from "react";
//import IconXSvg from "@/components/svgs/icons/IconXSvg";
//import GGModal from "@components/common/GGModal";
//import PhotoFilterExitModalElement from "@/components/modal-element/PhotoFilterExitModalElement";

import { Canvas, ColorMatrix, Image, Skia } from "@shopify/react-native-skia";
//import { COLORS } from "@/constants/GGColors";
//import { capitalizeFirstLetter } from "@/utils/core";
//import  COMMON_STYLES from "@/styles/common";

const { width, height } = Dimensions.get("window");

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
    ] // Mimics a pencil sketch by emphasizing grayscale with higher contrast and edge detection
};


function FilterOptionCard({
    id,
    title,
    image,
    matrix,
    setGeneralMatrix,
    filterSquareImageCurrentIndex,
    setFilterSquareImageCurrentIndex,
}: IThemed) {
    return (
        <TouchableOpacity
            onPress={() = {
                setFilterSquareImageCurrentIndex(id);
                setGeneralMatrix(matrix);
            } }
        >
        <View
            style

        </TouchableOpacity>
    )
}

function ItemSeparatorComponent() {

}

export default function ImageFilterSection({ source, retakeAction }: IThemed) {
    const [matrix, setMatrix] = useState(COLOUR_MATRIX.original);
    const data = Skia.Data.fromBase64(source.base64);
    const image = Skia.Image.MakeImageFromEncoded(data);

    const [
        filterSquareImageCurrentIndex,
        setFilterSquareImageCurrentIndex,
    ] = useState(0);

    const [modalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const DATA = Object.keys(COLOUR_MATRIX).map((matrixKey, index) => {
        return {
            id: index.toString(),
            type: `TYPE_$(index)`,
            title: capitalizeFirstLetter(matrixKey),
            matrix: (COLOUR_MATRIX as any)[matrixKey],
        };
    });
    return (
        <View style=(styles.container) >
        <Canvas style={{ width, height: height - 120 }}>
            <Image
                x={0}
                y={0}
                width={width}
                height={height - 120}
                image={image}
                fit="cover"
            >
                <ColorMatrix matrix={matrix}/>
            </Image>
        </Canvas>
        <SafeAreaView style={style.containerX}>
            <FlatList
                data={DATA}
                renderItem={({item}) => (
                    <FilterOptionCard 
                        id={item.id}
                        type={item.type}
                        title={item.title}
                        image={image}
                        matrix={item.matrix}
                        setGeneralMatrix={setMatrix}
                        filterSquareImageCurrentIndex={filterSquareImageCurrentIndex }
                        setFilterSquareImageCurrentIndex={setFilterSquareImageCurrentIndex }
                    />
                ) }
            >
            </FlatList>
        </SafeAreaView>
        </View >
    )

}

const styles = StyleSheet.create({

});SafeAreaView