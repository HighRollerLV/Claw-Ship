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
    const coinWidth = 30;
    const coinHeight = 30;

    const generateRandomPosition = (index) => {
        return {
            x: Math.random() * width,
            y: -(Math.random() * 500 + index * 50),
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
