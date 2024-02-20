import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Coin = React.memo(({ x, y, width, height }) => {
    return (
        <Image
            source={require('../../img/voyagerCar1.png')}
            style={[styles.image, { left: x, top: y, width: width, height: height }]}
            resizeMode="cover"
        />
    );
}, (prevProps, nextProps) => {
    return prevProps.x === nextProps.x && prevProps.y === nextProps.y && prevProps.width === nextProps.width && prevProps.height === nextProps.height;
});

const styles = StyleSheet.create({
    image: {
        position: 'absolute',
    },
});

export default Coin;




