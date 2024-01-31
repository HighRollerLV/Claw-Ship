let speedModifier = 1; // Initial speed modifier

const MoveCoin = (screenWidth, screenHeight) => (entities, { time }) => {
    let newEntities = {};
    // Increase the speed modifier over time
    speedModifier += 0.001; // Adjust this value to control how quickly the speed increases

    Object.keys(entities).forEach(key => {
        if (key.startsWith("coin")) {
            let coin = entities[key];
            coin.y += (0.1 * speedModifier) * time.delta;

            // Reset coin position if it goes off-screen
            if (coin.y > screenHeight) {
                coin.y = -50; // Start just above the screen
                coin.x = Math.random() * screenWidth; // New random x position
            }

            newEntities[key] = coin;
        } else {
            newEntities[key] = entities[key];
        }
    });
    return newEntities;
};

export default MoveCoin;

