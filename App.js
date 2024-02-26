import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, Text, Image, StyleSheet, Dimensions, View, TouchableOpacity} from 'react-native';
import {GameEngine} from 'react-native-game-engine';
import Coin from './src/components/Coin';
import Block from './src/components/Block';
import MoveCoin from './src/systems/MoveCoin';
import CollisionDetection from './src/systems/CollisionDetection';
import DragHandler from './src/systems/DragHandler';
import { Audio } from 'expo-av';

const {width, height} = Dimensions.get('window');
const defaultNumberOfCoins = 6;
const coinWidth = 35;
const coinHeight = 35;
const minimumDistance = 70;

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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },

    overlayImage: {
        position: 'absolute',
        width: 260,
        height: 260,
        resizeMode: 'cover',
        top: 0,
        transform: [{translateY: 100}],
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
    const [isLoading, setIsLoading] = useState(false);
    const [backgroundMusic, setBackgroundMusic] = useState(null); // State to hold background music object
    const [pingSound, setPingSound] = useState(null);

    useEffect(() => {
        const loadPingSound = async () => {
            return Audio.Sound.createAsync(
                require('./sound/pingTolmet.mp3') // Ensure you have a ping sound file
            ).then(({ sound }) => {
                setPingSound(sound);
            });
        };

        loadPingSound().catch(error => {
            console.error("Failed to load ping sound", error);
        });

        return () => {
            pingSound?.unloadAsync(); // Clean up
        };
    }, []);

// Function to play the ping sound
    const playPingSound = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('./sound/pingTolmet.mp3') // Ensure you have a ping sound file
        );
        await sound.playAsync();
        sound.setOnPlaybackStatusUpdate(async (status) => {
            if (status.didJustFinish) {
                await sound.unloadAsync(); // Unload sound from memory after playback is done
            }
        });
    };

    const playBackgroundMusic = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('./sound/gamingMusic.mp3'), // Replace with your own music file path
            { shouldPlay: true, isLooping: true }
        );
        setBackgroundMusic(sound); // Save the sound object for later use
    };

    useEffect(() => {
        if (gameStarted) {
            (async () => {
                await playBackgroundMusic();
            })();
        }

        return () => {
            backgroundMusic?.unloadAsync();
        };
    }, [gameStarted]);


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
                x: width / 2 - 100,
                y: height - 120,
                width: 100,
                height: 120,
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

    useEffect(() => {
        if (gameStarted && isLoading) {
            // Simulate or perform async entity loading here
            setTimeout(() => {
                const initialEntities = generateInitialEntities(calculateActiveCoins(0));
                setEntities(initialEntities); // Prepare entities
                setIsLoading(false); // End loading once entities are ready
            }, 5000); // Simulate async loading
        }
    }, [gameStarted, isLoading]);

    const startGame = useCallback(() => {
        setGameStarted(true);
        setIsLoading(true); // Trigger loading state
        // No need to set entities here; useEffect will handle it based on dependencies
        setScore(0);
        setLives(3);
        // Removal of direct entity setting allows useEffect to manage entity readiness
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

    if (lives <= 0) {
        return (
            <View style={styles.container}>
                <View style={styles.overlayContainer}>
                    <Image source={require('./img/tolmetsLogo2.png')} style={styles.overlayImage}/>
                    <Text style={styles.gameOverText}>Game Over</Text>
                    <Text style={styles.finalScoreText}>Final Score: {score}</Text>
                    <TouchableOpacity onPress={resetGame} style={styles.restartButton}>
                        <Text style={styles.restartButtonText}>Restart</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    // Conditional rendering based on game state
    if (isLoading) {
        // Show loading indicator while loading
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff"/>
            </View>
        );
    } else if (!gameStarted) {
        // Show start game view
        return (
            <View style={styles.container}>
                <View style={styles.overlayContainer}>
                    <Image source={require('./img/tolmetsLogo2.png')} style={styles.overlayImage}/>
                    <TouchableOpacity onPress={startGame} style={styles.startButton}>
                        <Text style={styles.startButtonText}>Start Game</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    } else {
        return (
            <View style={styles.gameContainer}>
                {/* Position the logo in the center of the screen without affecting gameplay */}
                <Image
                    source={require('./img/tolmetsLogo2.png')}
                    style={{
                        position: 'absolute',
                        width: 260, // Adjust based on the logo size
                        height: 260, // Adjust based on the logo size
                        resizeMode: 'contain', // Ensure the logo is scaled correctly
                        top: height / 2 - 130, // Center vertically, adjust based on the logo size
                        left: width / 2 - 130, // Center horizontally, adjust based on the logo size
                        opacity: 0.4, // Optionally set opacity to ensure game elements are visible
                    }}
                />

                {/* GameEngine and UI elements remain unchanged */}
                <GameEngine
                    systems={[
                        MoveCoin(width, height, setLives, resetSignal, coinWidth),
                        CollisionDetection(setScore, playPingSound, width), // Now passing playPingSound
                        DragHandler,
                    ]}
                    entities={entities}>
                    <Text style={styles.scoreText}>Score: {score}</Text>
                    <Text style={styles.livesText}>Lives: {lives}</Text>
                </GameEngine>
            </View>
        );
    }
}
