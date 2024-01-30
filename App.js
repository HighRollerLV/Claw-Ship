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
    const [timeRemaining, setTimeRemaining] = useState(90);
    const blockPositionX = useSharedValue(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCoins(currentCoins => [
                ...currentCoins,
                {id: Math.random(), startPosition: -100, leftPosition: Math.random() * width}
            ]);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (timeRemaining > 0) {
            const timer = setTimeout(() => {
                setTimeRemaining(timeRemaining - 1);
            }, 1000);

            return () => clearTimeout(timer);
        } else {
            alert(`Time's up! Your score: ${score}`);
        }
    }, [timeRemaining]);

    useEffect(() => {
        const collisionCheck = setInterval(() => {
            setCoins(currentCoins => currentCoins.filter(coin => {
                const coinSize = 20;
                const coinBottomY = coin.startPosition + coinSize;
                const coinLeftX = coin.leftPosition;
                const coinRightX = coin.leftPosition + coinSize;

                const blockWidth = 60;
                const blockHeight = 30;
                const blockBottomY = height - 50;
                const blockTopY = blockBottomY - blockHeight;
                const blockLeftX = blockPositionX.value;
                const blockRightX = blockPositionX.value + blockWidth;

                const isHorizontalOverlap = coinRightX > blockLeftX && coinLeftX < blockRightX;
                const isVerticalOverlap = coinBottomY > blockTopY && coin.startPosition < blockBottomY;

                if (isHorizontalOverlap && isVerticalOverlap) {
                    setScore(currentScore => currentScore + 1);
                    return false;
                } else if (coin.startPosition > height) {
                    return false;
                }
                return true;
            }));
        }, 25);

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
