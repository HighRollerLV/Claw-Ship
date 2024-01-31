import React, { useState } from 'react';
import { Text, StyleSheet, Dimensions, View, TouchableOpacity } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Coin from './src/components/Coin';
import Block from './src/components/Block';
import MoveCoin from './src/systems/MoveCoin';
import CollisionDetection from './src/systems/CollisionDetection';
import DragHandler from './src/systems/DragHandler';

const { width, height } = Dimensions.get('window');

export default function App() {
    const [score, setScore] = useState(0);
    const numberOfCoins = 20;
    const coinWidth = 20;
    const coinHeight = 20;
    const minimumDistance = 40;
    const [lives, setLives] = useState(3);
    const [resetSignal, setResetSignal] = useState(false);

    let previousPositions = [];

    const isTooClose = (x, y, previousPositions, minDistance) => {
        return previousPositions.some(pos =>
            Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2)) < minDistance
        );
    };

    const generateRandomPosition = (index) => {
        let x, y, randomYOffset;

        do {
            randomYOffset = Math.random() * 500;
            x = Math.random() * width;
            y = -(randomYOffset + index * 50);

        } while (isTooClose(x, y, previousPositions, minimumDistance));

        previousPositions.push({ x, y });

        return {
            x: x,
            y: y,
            width: coinWidth,
            height: coinHeight,
            renderer: Coin
        };
    };

    const generateEntities = () => {
        let entities = {
            block: { x: 0, y: height - 80, width: 60, height: 30, renderer: Block }
        };

        for (let i = 0; i < numberOfCoins; i++) {
            entities[`coin_${i}`] = generateRandomPosition(i);
        }

        return entities;
    };

    const resetGame = () => {
        setScore(0);
        setLives(3);
        setResetSignal(true); // Set the reset signal
        setTimeout(() => setResetSignal(false), 0); // Clear the signal
        // Reset any other state or game properties if necessary
    };

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

    return (
        <GameEngine
            systems={[MoveCoin(width, height, setLives, resetSignal), CollisionDetection(setScore), DragHandler]}
            entities={generateEntities()}>
            <Text style={styles.scoreText}>Score: {score}</Text>
            <Text style={styles.livesText}>Lives: {lives}</Text>
        </GameEngine>
    );
}

const styles = StyleSheet.create({
    scoreText: {
        position: 'absolute',
        top: 40,
        left: 40
    },
    livesText: {
        position: 'absolute',
        top: 40,
        right: 40, // Positioned on the top-right
        color: 'black',
    },
    gameOverText: {
        fontSize: 50,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    finalScoreText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    restartButton: {
        marginTop: 20,
        backgroundColor: '#007bff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5
    },
    restartButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});