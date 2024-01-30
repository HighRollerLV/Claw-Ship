import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import Animated, {useSharedValue, useAnimatedStyle, withTiming} from 'react-native-reanimated';

const screenHeight = Dimensions.get('window').height; // Get the screen height

const Coin = ({startPosition, leftPosition}) => {
    const fall = useSharedValue(startPosition);

    const animatedStyle = useAnimatedStyle(() => {
        // Ensure fall.value is defined and is a number
        if (typeof fall.value !== 'number') {
            console.warn('fall.value is not a number');
            return {};
        }
        return {
            transform: [{translateY: fall.value}],
        };
    });

    React.useEffect(() => {
        fall.value = withTiming(screenHeight, {duration: 3000}); // Animate to the bottom of the screen
    }, [fall, screenHeight]);

    return (
        <Animated.View style={[styles.coin, {left: leftPosition}, animatedStyle]}/>
    );
};

const styles = StyleSheet.create({
    coin: {
        width: 20,
        height: 20,
        backgroundColor: 'gold',
        borderRadius: 10,
        position: 'absolute',
    },
});

export default Coin;


