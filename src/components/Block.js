import React from 'react';
import {StyleSheet} from 'react-native';
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

const Block = ({blockPositionX}) => {
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
            // Logic for returning block to a specific position after release, if desired
        });

    const animatedStyle = useAnimatedStyle(() => {
        // Ensure translateX.value is defined and is a number
        if (typeof translateX.value !== 'number') {
            console.warn('translateX.value is not a number');
            return {};
        }
        return {
            transform: [{translateX: translateX.value}],
        };
    });

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.block, animatedStyle]}/>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    block: {
        width: 60,
        height: 30,
        backgroundColor: 'blue',
        position: 'absolute',
        bottom: 50,
    },
});

export default Block;
