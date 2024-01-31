import React, {useState} from 'react';
import {Text, StyleSheet, Dimensions} from 'react-native';
import {GameEngine} from 'react-native-game-engine';
import Coin from './src/components/Coin';
import Block from './src/components/Block';
import MoveCoin from './src/systems/MoveCoin';
import CollisionDetection from './src/systems/CollisionDetection';
import DragHandler from './src/systems/DragHandler';

const {width, height} = Dimensions.get('window');

export default function App() {
    const [score, setScore] = useState(0);
    const numberOfCoins = 20;
    const coinWidth = 20;
    const coinHeight = 20;
    const minimumDistance = 40; // Minimum distance between coins, adjust as needed

    let previousPositions = []; // To keep track of previous coin positions

    const isTooClose = (x, y, previousPositions, minDistance) => {
        return previousPositions.some(pos =>
            Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2)) < minDistance
        );
    };

    const generateRandomPosition = (index) => {
        let x, y, randomYOffset;

        do {
            randomYOffset = Math.random() * 500; // Adjust the range as needed
            x = Math.random() * width;
            y = -(randomYOffset + index * 50);

        } while (isTooClose(x, y, previousPositions, minimumDistance));

        previousPositions.push({ x, y }); // Keep track of the new position

        return {
            x: x,
            y: y,
            width: coinWidth,
            height: coinHeight,
            renderer: Coin
        };
    };

    const entities = {
        block: {x: 0, y: height - 80, width: 60, height: 30, renderer: Block},
        ...Array.from({length: numberOfCoins}).reduce((acc, _, index) => {
            acc[`coin_${index}`] = generateRandomPosition(index);
            return acc;
        }, {})
    };

    return (
        <GameEngine
            systems={[MoveCoin(width, height), CollisionDetection(setScore), DragHandler]}
            entities={entities}>
            <Text style={styles.scoreText}>Score: {score}</Text>
        </GameEngine>
    );
}

const styles = StyleSheet.create({
    scoreText: {
        position: 'absolute',
        top: 40,
        left: 40
    }
});
