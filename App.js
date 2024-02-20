import React, {useCallback, useEffect, useState} from 'react';
import {Text, Image, StyleSheet, Dimensions, View, TouchableOpacity} from 'react-native';
import {GameEngine} from 'react-native-game-engine';
import Coin from './src/components/Coin';
import Block from './src/components/Block';
import MoveCoin from './src/systems/MoveCoin';
import CollisionDetection from './src/systems/CollisionDetection';
import DragHandler from './src/systems/DragHandler';

const {width, height} = Dimensions.get('window');
const defaultNumberOfCoins = 6;
const coinWidth = 60;
const coinHeight = 60;
const minimumDistance = 60;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    gameContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scoreText: {
        position: 'absolute',
        top: 40,
        left: 40,
        color: 'black',
        fontSize: 24,
    },
    livesText: {
        position: 'absolute',
        top: 40,
        right: 40,
        color: 'black',
        fontSize: 24,
    },
    gameOverText: {
        fontSize: 48,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    finalScoreText: {
        fontSize: 24,
        textAlign: 'center',
        marginTop: 20,
    },
    startButton: {
        paddingHorizontal: 30,
        paddingVertical: 20,
        backgroundColor: '#F5842A',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: 'black',
    },
    startButtonText: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
    },
    overlayContainer: {
        flex: 1, // Take full height of the parent container
        justifyContent: 'center', // Align children (the button) vertically in the center
        alignItems: 'center', // Align children (the button) horizontally in the center
        position: 'relative', // Allows absolute positioning of the logo relative to this container
    },

    overlayImage: {
        position: 'absolute',
        width: 260, // Adjust the width as needed
        height: 260, // Adjust the height as needed
        resizeMode: 'cover', // Keeps the aspect ratio, adjust as needed
        top: 0, // Position at the top of the overlayContainer
        transform: [{translateY: 100}], // Move up by half the height of the image or adjust as needed
    },
    restartButton: {
        marginTop: 20,
        backgroundColor: '#F5842A',
        paddingHorizontal: 30,
        paddingVertical: 20,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: 'black',
    },
    restartButtonText: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
    },
});

export default function App() {
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [gameStarted, setGameStarted] = useState(false);
    const [entities, setEntities] = useState({});
    const [resetSignal, setResetSignal] = useState(false);

    useEffect(() => {
        setEntities(generateInitialEntities(calculateActiveCoins(score))); // Adjust entities based on score
    }, [score, gameStarted]);

    const isTooClose = useCallback((x, y, previousPositions) => {
        return previousPositions.some(pos =>
            Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2)) < minimumDistance
        );
    }, []);

    const generateRandomPosition = useCallback((previousPositions) => {
        let x, y;
        do {
            x = Math.random() * (width - coinWidth); // Adjust to ensure coins start fully on-screen
            y = -Math.random() * 500; // Ensure coins start off-screen
        } while (isTooClose(x, y, previousPositions));
        return {x, y};
    }, [isTooClose]);

    const calculateActiveCoins = useCallback((score) => {
        // Start with 5 coins, increase by 5 for every 20 points scored
        return defaultNumberOfCoins + Math.floor(score / 20) * 5;
    }, []);


    const generateInitialEntities = useCallback((numCoins) => {
        let entities = {
            block: {
                x: width / 2 - 30,
                y: height - 80,
                width: 70,
                height: 60,
                renderer: <Block/>,
            },
        };
        let previousPositions = [];
        for (let i = 0; i < numCoins; i++) {
            const {x, y} = generateRandomPosition(previousPositions);
            entities[`coin_${i}`] = {
                x,
                y,
                width: coinWidth,
                height: coinHeight,
                renderer: <Coin/>,
            };
            previousPositions.push({x, y});
        }
        return entities;
    }, []);

    const startGame = useCallback(() => {
        setGameStarted(true);
        setScore(0); // Reset score when game starts
        setLives(3); // Reset lives
        setEntities(generateInitialEntities(calculateActiveCoins(score))); // Initialize entities with dynamic number of coins based on score
    }, []);

    const resetGame = useCallback(() => {
        setScore(0);
        setLives(3);
        setGameStarted(false);
        setResetSignal(true); // Trigger a reset
        setTimeout(() => {
            setResetSignal(false);
            setEntities(generateInitialEntities(calculateActiveCoins(score))); // Reset entities upon game reset with dynamic number of coins
        }, 100);
    }, []);

    // Conditional rendering based on game state
    if (!gameStarted) {
        return (
            <View style={styles.container}>
                <View style={styles.overlayContainer}>
                    <Image source={require('./img/tolmetsLogo.png')} style={styles.overlayImage}/>
                    <TouchableOpacity onPress={startGame} style={styles.startButton}>
                        <Text style={styles.startButtonText}>Start Game</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }


    if (lives <= 0) {
        return (
            <View style={styles.container}>
                <View style={styles.overlayContainer}>
                    <Image source={require('./img/tolmetsLogo.png')} style={styles.overlayImage}/>
                    <Text style={styles.gameOverText}>Game Over</Text>
                    <Text style={styles.finalScoreText}>Final Score: {score}</Text>
                    <TouchableOpacity onPress={resetGame} style={styles.restartButton}>
                        <Text style={styles.restartButtonText}>Restart</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Main game rendering
    return (
        <GameEngine
            style={styles.gameContainer}
            systems={[
                MoveCoin(width, height, setLives, resetSignal, coinWidth), // Now includes coinWidth
                CollisionDetection(setScore, width),
                DragHandler,
            ]}
            entities={entities}>
            <Text style={styles.scoreText}>Score: {score}</Text>
            <Text style={styles.livesText}>Lives: {lives}</Text>
        </GameEngine>
    );
}
