import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Coin = ({ x, y, width, height }) => {
    return (
        <Image
            source={require('../../img/voyagerCar1.png')} // Ensure the path is correct
            style={[styles.image, { left: x, top: y, width: width, height: height }]}
            resizeMode="cover" // Adjust as needed to fit your design
        />
    );
};

const styles = StyleSheet.create({
    image: {
        position: 'absolute', // Keeps the absolute positioning for layout
    },
});

export default Coin;



