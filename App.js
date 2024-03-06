import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, Image, Dimensions, View, TouchableOpacity } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Coin from './src/components/Coin';
import Block from './src/components/Block';
import MoveCoin from './src/systems/MoveCoin';
import CollisionDetection from './src/systems/CollisionDetection';
import DragHandler from './src/systems/DragHandler';
import { Audio } from 'expo-av';
import styles from './AppStyles'; // Custom styles

// Get device's width and height for layout calculations
const { width, height } = Dimensions.get('window');
// Default settings
const defaultNumberOfCoins = 6;
const coinWidth = 35;
const coinHeight = 35;
const minimumDistance = 70; // Minimum distance for collision to be considered

export default function App() {
    const [score, setScore] = useState(0); // State for the player's score
    const [lives, setLives] = useState(3); // State for the player's lives
    const [gameStarted, setGameStarted] = useState(false); // State to track if the game has started
    const [entities, setEntities] = useState({}); // State to store game entities
    const [resetSignal, setResetSignal] = useState(false); // State to handle game reset
    const [isLoading, setIsLoading] = useState(false); // State to track if the game is loading
    const [backgroundMusic, setBackgroundMusic] = useState(null); // State to hold background music object
    const [pingSound, setPingSound] = useState(null); // State to hold the sound played on scoring

// Using Reacts useEffect to handle side effects within functional components
    useEffect(() => {
        // Async function to load the ping sound from local assets
        const loadPingSound = async () => {
            // Creating and loading an audio object for the ping sound
            return Audio.Sound.createAsync(
                require('./sound/pingTolmet.mp3') // Path to the sound file
            ).then(({sound}) => {
                setPingSound(sound); // Saving the loaded sound in state for later use
            });
        };

        // Initiating the sound loading and handling any potential errors
        loadPingSound().catch(error => {
            console.error("Failed to load ping sound", error);
        });

        // Cleanup function to unload the sound from memory when the component unmounts or re-renders
        return () => {
            pingSound?.unloadAsync();
        };
    }, []); // Empty dependency array means this effect runs once on mount

// Function to play the ping sound when called
    const playPingSound = async () => {
        const {sound} = await Audio.Sound.createAsync(
            require('./sound/pingTolmet.mp3')
        );
        await sound.playAsync();
        sound.setOnPlaybackStatusUpdate(async (status) => {
            if (status.didJustFinish) {
                await sound.unloadAsync(); // Automatically unloading the sound once it finishes playing
            }
        });
    };

// Function to play background music continuously during the game
    const playBackgroundMusic = async () => {
        const {sound} = await Audio.Sound.createAsync(
            require('./sound/gamingMusic.mp3'), // Loading a background music file
            {shouldPlay: true, isLooping: true} // Setting music to play immediately and loop
        );
        setBackgroundMusic(sound); // Saving the sound object for pausing or stopping later
    };

// useEffect hook to handle playing background music when the game starts
    useEffect(() => {
        if (gameStarted) {
            (async () => {
                await playBackgroundMusic(); // Playing background music asynchronously
            })();
        }

        // Cleanup function to unload the music from memory when the game stops
        return () => {
            backgroundMusic?.unloadAsync();
        };
    }, [gameStarted]); // This effect depends on the gameStarted state

// useEffect hook to update game entities based on the player's score
    useEffect(() => {
        setEntities(generateInitialEntities(calculateActiveCoins(score))); // Generating entities based on current score
    }, [score, gameStarted]); // This effect depends on score and gameStarted state changes

// Define a function to check if a new position is too close to any existing positions
    const isTooClose = useCallback((x, y, previousPositions) => {
        // Use 'some' to check if at least one position is within a minimum distance
        return previousPositions.some(pos =>
            Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2)) < minimumDistance
        );
    }, []);

// Generate a random position for a new entity, ensuring it does not overlap with existing entities
    const generateRandomPosition = useCallback((previousPositions) => {
        let x, y;
        do {
            // Generate random x within screen bounds, adjusting for entity width
            x = Math.random() * (width - coinWidth);
            // Generate random y above the screen to simulate falling
            y = -Math.random() * 500;
        } while (isTooClose(x, y, previousPositions)); // Repeat if position is too close to an existing one
        return {x, y};
    }, [isTooClose]);

// Calculate the number of active coins based on the current score
    const calculateActiveCoins = useCallback((score) => {
        // Increase number of coins by 5 for every 20 points scored
        return defaultNumberOfCoins + Math.floor(score / 20) * 5;
    }, []);

// Populate the initial game entities based on the number of coins
    const generateInitialEntities = useCallback((numCoins) => {
        let entities = {
            // Static block entity
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
            // Add coin entity with random position
            entities[`coin_${i}`] = {
                x,
                y,
                width: coinWidth,
                height: coinHeight,
                renderer: <Coin/>,
            };
            // Keep track of coin positions to avoid overlap
            previousPositions.push({x, y});
        }
        return entities;
    }, []);

// Initialize game entities once the game starts and is loading
    useEffect(() => {
        if (gameStarted && isLoading) {
            // Delay to simulate async loading (e.g., loading assets)
            setTimeout(() => {
                const initialEntities = generateInitialEntities(calculateActiveCoins(0));
                setEntities(initialEntities); // Set the initial entities for the game
                setIsLoading(false); // Mark loading as complete
            }, 5000); // Delay duration in milliseconds
        }
    }, [gameStarted, isLoading]);

// Hook to start the game, initializes game state.
    const startGame = useCallback(() => {
        setGameStarted(true); // Mark the game as started.
        setIsLoading(true); // Enable loading state, typically for async setup tasks.
        // Initial game stat's setup.
        setScore(0); // Reset score to 0.
        setLives(3); // Set initial number of lives to 3.
        // Entities are set up in a useEffect based on dependencies, not here, for cleaner separation of concerns.
    }, []);

// Hook to reset the game to its initial state.
    const resetGame = useCallback(() => {
        setScore(0); // Reset score to 0.
        setLives(3); // Reset lives to 3.
        setGameStarted(false); // Mark game as not started.
        setResetSignal(true); // Signal to trigger a reset in components or hooks listening to this state.
        setTimeout(() => {
            setResetSignal(false); // Clear reset signal after a short delay.
            // Re-initialize game entities, potentially with adjustments based on the score.
            setEntities(generateInitialEntities(calculateActiveCoins(score)));
        }, 100); // Short delay to allow other components to react to reset signal.
    }, []);

// Conditionally render game over, loading, start, or game play views based on game state.
    if (lives <= 0) {
        // Render game over screen when no lives are left.
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

    if (isLoading) {
        // Render loading indicator during loading phase.
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff"/>
            </View>
        );
    } else if (!gameStarted) {
        // Render start game view when game has not started yet.
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
        // Main game view rendering when game is active.
        return (
            <View style={styles.gameContainer}>
                <Image
                    source={require('./img/tolmetsLogo2.png')}
                    style={{
                        position: 'absolute',
                        width: 260,
                        height: 260,
                        resizeMode: 'contain',
                        top: height / 2 - 130,
                        left: width / 2 - 130,
                        opacity: 0.4,
                    }}
                />
                <GameEngine
                    systems={[
                        MoveCoin(width, height, setLives, resetSignal, coinWidth),
                        CollisionDetection(setScore, playPingSound, width),
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