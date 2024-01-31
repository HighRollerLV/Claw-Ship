// src/components/Coin.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

const Coin = ({ x, y, width, height }) => {
    return (
        <View style={[styles.coin, { left: x, top: y, width, height }]} />
    );
};

const styles = StyleSheet.create({
    coin: {
        position: 'absolute',
        backgroundColor: 'gold',
        borderRadius: 20
    }
});

export default Coin;
