// Import necessary modules from React and React Native
import React from 'react';
import { Image, StyleSheet } from 'react-native';

// Define a functional component named Block that accepts props for positioning and sizing
const Block = ({ x, y, width, height }) => {
    return (
        // Render an Image component from React Native
        <Image
            source={require('../../img/fuksis.jpg')}
            style={[
                styles.image,
                { left: x, top: y, width: width, height: height }
            ]}
            resizeMode="cover"
        />
    );
};

const styles = StyleSheet.create({
    image: {
        position: 'absolute', // Position the image absolutely within its parent container, allowing it to be placed using top, left, right, and bottom values
    },
});

export default Block;