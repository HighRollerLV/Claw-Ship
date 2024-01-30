// App.js
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

    const entities = {
        block: {x: 0, y: height - 80, width: 60, height: 30, renderer: Block},
        ...Array.from({length: 5}).reduce((acc, _, index) => {
            acc[`coin_${index}`] = {
                x: Math.random() * width,
                y: -100,
                width: 20,
                height: 20,
                renderer: Coin
            };
            return acc;
        }, {})
    };

    return (
        <GameEngine
            systems={[MoveCoin, CollisionDetection(setScore), DragHandler]}
            entities={entities}>
            <Text style={styles.scoreText}>Score: {score}</Text>
        </GameEngine>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    scoreText: {
        position: 'absolute',
        top: 40,
        left: 40
    }
});

