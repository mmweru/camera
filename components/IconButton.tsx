import Ionicons from "@expo/vector-icons/Ionicons";
import React, { ComponentProps } from "react";
import { SFSymbol, SymbolView } from "expo-symbols";
import { StyleProp, TouchableOpacity, ViewStyle, Text } from "react-native"; // Import Text

const CONTAINER_PADDING = 5;
const CONTAINER_WIDTH = 34;
const ICON_SIZE = 25;

interface IconButtonProps {
    iosName: SFSymbol;
    androidName: ComponentProps<typeof Ionicons>["name"];
    containerStyle?: StyleProp<ViewStyle>; // For the button container style
    onPress?: () => void;
    width?: number;
    height?: number;
    style?: StyleProp<ViewStyle>; // Add this line to accept custom styles for children
    children?: React.ReactNode; // Allow children to be passed in
}

export default function IconButton({
    androidName,
    iosName,
    containerStyle,
    onPress,
    width,
    height,
    style, // Accept style prop here
    children, // Accept children here
}: IconButtonProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                {
                    backgroundColor: '#00000050',
                    padding: CONTAINER_PADDING,
                    borderRadius: (CONTAINER_WIDTH + CONTAINER_PADDING * 2) / 2,
                    width: CONTAINER_WIDTH,
                },
                containerStyle,
            ]}
        >
            <SymbolView
                name={iosName}
                size={ICON_SIZE}
                style={width && height ? { width, height } : {}}
                type="hierarchical"
                tintColor={"white"}
                fallback={
                    <Ionicons size={ICON_SIZE} name={androidName} color={"white"} />
                }
            />
            {React.Children.map(children, (child) => {
                // Check if the child is a string or number, and wrap it in a <Text> component if it is
                return typeof child === 'string' || typeof child === 'number' ? (
                    <Text style={{ color: 'white' }}>{child}</Text> // Use Text component for strings/numbers
                ) : (
                    child // Return the child as-is if it's not a string or number
                );
            })}
        </TouchableOpacity>
    );
}
