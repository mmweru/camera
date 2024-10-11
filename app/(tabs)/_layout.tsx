import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFirstTimeOpen } from '../../hooks/useFirstTimeOpen';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const { isFirstTime, isLoading } = useFirstTimeOpen();

    if (isLoading) return <></>;
    if (isFirstTime) return <Redirect href={"/onboarding"} />;

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
            }}>
            <Tabs.Screen
                name="index" // Home screen
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={"camera"} color={color} />
                    ),
                }}
            />
            {/*<Tabs.Screen*/}
            {/*    name="MediaLibrary" // Media Library screen*/}
            {/*    options={{*/}
            {/*        title: 'Media', // Title for the tab*/}
            {/*        tabBarIcon: ({ color, focused }) => (*/}
            {/*            <TabBarIcon name={"images"} color={color} /> // Icon for Media Library*/}
            {/*        ),*/}
            {/*    }}*/}
            {/*/>*/}
        </Tabs>
    );
}
