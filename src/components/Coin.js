// Import necessary modules from React and React Native
import React from 'react';
import { Image, StyleSheet } from 'react-native';

// Define the Coin component using React.memo for performance optimization.
// React.memo will only allow the component to re-render if its props have changed.
// The component takes x, y, width, and height as props for positioning and sizing.
const Coin = React.memo(({ x, y, width, height }) => {
    // Return an Image component with:
    // - A specified source image from the local file system.
    // - A style that combines a base style from `styles.image` with inline styles for positioning and sizing.
    // - A resizeMode of "cover" to ensure the image covers the specified area without distortion.
    return (
        <Image
            source={require('../../img/voyager_edit2.png')}
            style={[styles.image, { left: x, top: y, width: width, height: height }]}
            resizeMode="cover"
        />
    );
}, (prevProps, nextProps) => {
    // Custom comparison function for React.memo to determine if the component should re-render.
    // It returns true (avoid re-render) if the x, y, width, and height props haven't changed.
    return prevProps.x === nextProps.x && prevProps.y === nextProps.y && prevProps.width === nextProps.width && prevProps.height === nextProps.height;
});

// `image` style sets the position to 'absolute', allowing explicit positioning within its parent.
const styles = StyleSheet.create({
    image: {
        position: 'absolute',
    },
});

export default Coin;