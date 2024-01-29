import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, Dimensions, Text, Animated, PanResponder} from 'react-native';
import Coin from './Coin';
import Block from './Block';
import {spawnCoin, checkForCollisions} from '../utils/collisionUtils';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const GameArea = () => {
    const blockWidth = 50;
    const blockHeight = 20;
    const blockInitialX = windowWidth / 2 - blockWidth / 2;
    const blockY = windowHeight - blockHeight; // Fixed Y position

    const blockX = useRef(new Animated.Value(blockInitialX)).current;
    const [coins, setCoins] = useState([]);
    const [score, setScore] = useState(0);

    useEffect(() => {
        // Game loop for updating coin positions, spawning new coins, and checking collisions
        const gameLoop = setInterval(() => {
            setCoins(prevCoins => {
                let updatedCoins = [...prevCoins];

                // Check if we need to add a new coin
                if (prevCoins.length < 10) {
                    const {newCoin, startAnimation} = spawnCoin();
                    updatedCoins.push(newCoin);

                    // Start the coin's animation and remove it when it goes off-screen
                    startAnimation(() => {
                        setCoins(coins => coins.filter(c => c !== newCoin));
                    });
                }

                // Update the position of each coin
                return updatedCoins.map(coin => {
                    let newY = coin.y._value + 2; // Move the coin down each frame
                    coin.y.setValue(newY);
                    return coin;
                });
            });

            // Check for collisions
            checkForCollisions(coins, {x: blockX, y: blockY}, setScore);
        }, 1000 / 60); // 60 FPS game loop

        return () => clearInterval(gameLoop);
    }, [coins, blockX, blockY, setScore]);

    // PanResponder to handle block dragging
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event(
                [null, {dx: blockX}], // dx is the accumulated distance of the gesture in the X direction
                {useNativeDriver: false}
            ),
            onPanResponderRelease: () => {
                // Restrict block within the screen width
                blockX.flattenOffset();
                if (blockX._value < 0) {
                    blockX.setValue(0);
                } else if (blockX._value > windowWidth - blockWidth) {
                    blockX.setValue(windowWidth - blockWidth);
                }
            },
            onPanResponderGrant: () => {
                blockX.setOffset(blockX._value);
                blockX.setValue(0);
            },
        })
    ).current;


    return (
        <View style={styles.gameArea}>
            <Animated.View
                style={[
                    styles.block,
                    {transform: [{translateX: blockX}], bottom: blockY}
                ]}
                {...panResponder.panHandlers}
            >
                <Block/>
            </Animated.View>
            {coins.map((coin, index) => (
                <Coin key={index} x={coin.x} y={coin.y}/>
            ))}
            <Text style={styles.score}>Score: {score}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    gameArea: {
        flex: 1,
        backgroundColor: '#eaeaea',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center'
    },
    block: {
        width: 50,
        height: 20,
        backgroundColor: 'blue',
        position: 'absolute'
    },
    score: {
        position: 'absolute',
        top: 10,
        left: 10,
        fontSize: 24,
        color: 'black'
    }
});

export default GameArea;

