import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Block = ({ x, y, width, height }) => {
    return (
        <Image
            source={require('../../img/fuchsProp.png')} // Adjust the path to where your image is located
            style={[styles.image, { left: x, top: y, width: width, height: height }]}
            resizeMode="cover" // Adjust this as needed
        />
    );
};

const styles = StyleSheet.create({
    image: {
        position: 'absolute', // Keeps the absolute positioning for layout
    },
});

export default Block;
