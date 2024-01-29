import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import GameArea from "../components/GameArea";

const GameScreen = () => {
    const [gameState, setGameState] = useState('start');

    const startGame = () => {
        setGameState('playing');
    };

    return (
        <View style={styles.screen}>
            {gameState === 'start' && (
                <TouchableOpacity onPress={startGame} style={styles.startButton}>
                    <Text>Start Game</Text>
                </TouchableOpacity>
            )}
            {gameState === 'playing' && <GameArea />}
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    startButton: {
        padding: 10,
        backgroundColor: 'blue',
        borderRadius: 5
    }
});

export default GameScreen;



