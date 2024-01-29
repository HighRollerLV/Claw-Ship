import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const Coin = ({ size, startPosition, leftPosition }) => {
    const fall = useSharedValue(startPosition);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: fall.value }],
        };
    });

    React.useEffect(() => {
        fall.value = withTiming(800, { duration: 3000 });
    }, []);

    return (
        <Animated.View style={[styles.coin, { width: size, height: size, left: leftPosition }, animatedStyle]} />
    );
};

const styles = StyleSheet.create({
    coin: {
        backgroundColor: 'gold',
        borderRadius: 50,
        position: 'absolute',
    },
});

export default Coin;
