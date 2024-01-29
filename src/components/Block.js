import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const Block = ({ size, blockPositionX }) => {
    const translateX = useSharedValue(0);

    React.useEffect(() => {
        blockPositionX.value = translateX.value;
    }, [translateX]);

    const panGesture = Gesture.Pan()
        .onStart(() => {
            translateX.value = withSpring(0);
        })
        .onUpdate((event) => {
            translateX.value = event.translationX;
        })
        .onEnd(() => {
            // Add logic if you want the block to return to a specific position after release
        });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.block, { width: size, height: size }, animatedStyle]} />
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    block: {
        backgroundColor: 'blue',
        position: 'absolute',
        bottom: 50, // Adjust as needed
    },
});

export default Block;
