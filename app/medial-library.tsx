//import React, { useEffect, useState } from 'react';
//import { View, FlatList, Image, StyleSheet, Text } from 'react-native';
//import * as MediaLibrary from 'expo-media-library';

import { Image } from "expo-image";
import { Asset, getAssetsAsync } from "expo-media-library";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";

//const MediaLibraryScreen = () => {
//    const [photos, setPhotos] = useState<any[]>([]);
//    const [loading, setLoading] = useState(true);

//    useEffect(() => {
//        const fetchPhotos = async () => {
//            const { status } = await MediaLibrary.requestPermissionsAsync();
//            if (status === 'granted') {
//                const assets = await MediaLibrary.getAssetsAsync({ mediaType: 'photo' });
//                setPhotos(assets.assets);
//            } else {
//                alert('Permission to access camera roll is required!');
//            }
//            setLoading(false);
//        };

//        fetchPhotos();
//    }, []);

//    if (loading) {
//        return <Text>Loading...</Text>;
//    }

//    return (
//        <View style={styles.container}>
//            <FlatList
//                data={photos}
//                keyExtractor={(item) => item.id}
//                renderItem={({ item }) => (
//                    <Image
//                        source={{ uri: item.uri }}
//                        style={styles.image}
//                    />
//                )}
//                numColumns={3}
//            />
//        </View>
//    );
//};

//const styles = StyleSheet.create({
//    container: {
//        flex: 1,
//        padding: 10,
//        backgroundColor: '#fff',
//    },
//    image: {
//        width: '30%',
//        height: 120,
//        margin: 5,
//    },
//});

//export default MediaLibraryScreen;
export default function MediaLibraryScreen() {
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
        });

        setAssets(albumAssets.assets)
    }
    return (
        <>
            <ScrollView contentContainerStyle={{
                flexDirection: "row",
                flexWrap: "wrap",
            } }>
                {assets.map((photo) => (
                    <Image key={photo.id}
                        source={photo.uri}
                        style={{ width: "25%", height: 100 }}
                    />
                ))}
            </ScrollView>
        </>
    )
}