import React from 'react';
import { View, StyleSheet } from 'react-native';

const Block = ({ x, y, width, height }) => {
    return (
        <View style={[styles.block, { left: x, top: y, width, height }]} />
    );
};

const styles = StyleSheet.create({
    block: {
        position: 'absolute',
        backgroundColor: 'blue'
    }
});

export default Block;