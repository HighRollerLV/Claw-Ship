import React, { useState } from 'react';
import { Text, StyleSheet, Dimensions, View, TouchableOpacity } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Coin from './src/components/Coin';
import Block from './src/components/Block';
import MoveCoin from './src/systems/MoveCoin';
import CollisionDetection from './src/systems/CollisionDetection';
import DragHandler from './src/systems/DragHandler';

const { width, height } = Dimensions.get('window');
const numberOfCoins = 15;
const coinWidth = 20;
const coinHeight = 20;
const minimumDistance = 60;

export default function App() {
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [gameStarted, setGameStarted] = useState(false);
    // State "entities" not directly used, hence omitted in the destructuring
    const [, setEntities] = useState({});
    const [resetSignal, setResetSignal] = useState(false); // Added for reset signaling

    function isTooClose(x, y, previousPositions) {
        return previousPositions.some(pos =>
            Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2)) < minimumDistance
        );
    }

    function generateRandomPosition(previousPositions) {
        let x, y;
        do {
            x = Math.random() * width;
            y = -(Math.random() * 500); // Ensure coins start off-screen
        } while (isTooClose(x, y, previousPositions));
        return { x, y };
    }

    function generateInitialEntities() {
        let entities = {
            block: {
                x: width / 2 - 30,
                y: height - 80,
                width: 60,
                height: 30,
                renderer: <Block />,
            },
        };
        let previousPositions = [];
        for (let i = 0; i < numberOfCoins; i++) {
            const { x, y } = generateRandomPosition(previousPositions);
            entities[`coin_${i}`] = {
                x,
                y,
                width: coinWidth,
                height: coinHeight,
                renderer: <Coin />,
            };
            previousPositions.push({ x, y });
        }
        return entities;
    }

    const startGame = () => {
        setGameStarted(true);
        setEntities(generateInitialEntities()); // Initialize entities when the game starts
        setResetSignal(false); // Ensure resetSignal is false when starting
    };

    const resetGame = () => {
        setScore(0);
        setLives(3);
        setGameStarted(false);
        setResetSignal(true); // Trigger a reset
        setTimeout(() => setResetSignal(false), 100); // Then clear the signal shortly after
    };

    // Conditional rendering based on game state
    if (!gameStarted) {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={startGame} style={styles.startButton}>
                    <Text style={styles.startButtonText}>Start Game</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (lives <= 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.gameOverText}>Game Over</Text>
                <Text style={styles.finalScoreText}>Final Score: {score}</Text>
                <TouchableOpacity onPress={resetGame} style={styles.restartButton}>
                    <Text style={styles.restartButtonText}>Restart</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Main game rendering
    return (
        <GameEngine
            style={styles.gameContainer}
            systems={[MoveCoin(width, height, setLives, resetSignal), CollisionDetection(setScore), DragHandler]}
            entities={generateInitialEntities()}>
            <Text style={styles.scoreText}>Score: {score}</Text>
            <Text style={styles.livesText}>Lives: {lives}</Text>
        </GameEngine>
    );
}

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
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'green',
        borderRadius: 5,
    },
    startButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    restartButton: {
        marginTop: 20,
        backgroundColor: '#007bff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    restartButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
