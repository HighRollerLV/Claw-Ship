import { StyleSheet } from 'react-native';

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
export default styles;