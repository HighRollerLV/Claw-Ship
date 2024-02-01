const MoveCoin = (screenWidth, screenHeight, setLives, resetSignal) => (entities, {time}) => {
    // Check for a reset signal to reset speedModifier to its default
    if (entities.speedModifier === undefined || resetSignal) {
        entities.speedModifier = 0.5; // Default speedModifier value
    } else {
        // Increment speedModifier over time
        entities.speedModifier += 0.0009;
    }

    Object.keys(entities).forEach(key => {
        if (key.startsWith("coin")) {
            let coin = entities[key];
            coin.y += (0.1 * entities.speedModifier) * time.delta;

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