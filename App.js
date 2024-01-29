import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Coin from "./src/components/Coin";
import Block from "./src/components/Block";
import {useSharedValue} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');

export default function App() {
    const [coins, setCoins] = useState([]);
    const [score, setScore] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(90); // 1 minute 30 seconds
    const blockPositionX = useSharedValue(0); // Shared value for block's X position

    useEffect(() => {
        const interval = setInterval(() => {
            setCoins(currentCoins => [
                ...currentCoins,
                {id: Math.random(), startPosition: -100, leftPosition: Math.random() * width}
            ]);
        }, 1000); // Generate new coins every second

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (timeRemaining > 0) {
            const timer = setTimeout(() => {
                setTimeRemaining(timeRemaining - 1);
            }, 1000);

            return () => clearTimeout(timer);
        } else {
            // Game Over logic goes here
            alert(`Time's up! Your score: ${score}`);
        }
    }, [timeRemaining]);

    useEffect(() => {
        const collisionCheck = setInterval(() => {
            setCoins(currentCoins => currentCoins.filter(coin => {
                const coinBottomY = coin.startPosition + 30; // Assuming coin size is 30
                const coinLeftX = coin.leftPosition;
                const coinRightX = coin.leftPosition + 30;

                const blockWidth = 60; // Assuming block width
                const blockHeight = 60; // Assuming block height
                const blockBottomY = height - 50; // Assuming block is 50 pixels from the bottom
                const blockTopY = blockBottomY - blockHeight;
                const blockLeftX = blockPositionX.value;
                const blockRightX = blockPositionX.value + blockWidth;

                // Check horizontal overlap
                const isHorizontalOverlap = coinLeftX < blockRightX && coinRightX > blockLeftX;

                // Check vertical overlap
                const isVerticalOverlap = coinBottomY > blockTopY && coinBottomY < blockBottomY;

                if (isHorizontalOverlap && isVerticalOverlap) {
                    setScore(currentScore => currentScore + 1); // Increase score
                    return false; // Coin is caught, remove it
                } else if (coinBottomY > height) {
                    return false; // Coin missed and moved off-screen, remove it
                }

                return true; // Coin not caught or missed yet, keep it
            }));
        }, 50);

        return () => clearInterval(collisionCheck);
    }, []);

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <View style={styles.container}>
                <Text>Score: {score}</Text>
                <Text>Time Remaining: {timeRemaining}</Text>
                {coins.map(coin => (
                    <Coin key={coin.id} size={30} startPosition={coin.startPosition} leftPosition={coin.leftPosition}/>
                ))}
                <Block size={60} blockPositionX={blockPositionX}/>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
