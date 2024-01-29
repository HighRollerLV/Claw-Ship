import { Animated, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
export const spawnCoin = () => {
    let newCoin = new Animated.ValueXY({ x: Math.random() * (screenWidth - 30), y: 0 });

    // Return the new coin and a function to start its animation
    return {
        newCoin,
        startAnimation: (onAnimationEnd) => {
            Animated.timing(newCoin, {
                toValue: { x: newCoin.x._value, y: screenHeight },
                duration: 5000,
                useNativeDriver: false,
            }).start(() => onAnimationEnd());
        }
    };
};

export const checkForCollisions = (coins, blockPosition, setScore) => {
    coins.forEach((coin, index) => {
        if (coin.y._value > screenHeight - 50 && coin.y._value < screenHeight - 20) {
            if (coin.x._value > blockPosition.x._value && coin.x._value < blockPosition.x._value + 60) {
                // Collision detected
                setScore((prevScore) => prevScore + 1);
                coins.splice(index, 1); // Remove the coin
            }
        }
    });
};
