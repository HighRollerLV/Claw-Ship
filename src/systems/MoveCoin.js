let speedModifier = 0.5; // Initial value of speedModifier

const MoveCoin = (screenWidth, screenHeight, setLives) => (entities, { time }) => {
    speedModifier += 0.001; // Increment speedModifier over time

    Object.keys(entities).forEach(key => {
        if (key.startsWith("coin")) {
            let coin = entities[key];
            coin.y += (0.1 * speedModifier) * time.delta;

            if (coin.y > screenHeight) {
                coin.y = -50; // Reset coin position
                coin.x = Math.random() * screenWidth;
                setLives(lives => lives - 1); // Decrease a life
            }
        }
    });

    return entities;
};

export default MoveCoin;

