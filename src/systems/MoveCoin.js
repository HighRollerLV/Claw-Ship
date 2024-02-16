const MoveCoin = (screenWidth, screenHeight, setLives, resetSignal, coinWidth) => {
    // Define the isTooClose function to check proximity between coins
    function isTooClose(newX, newY, entities) {
        return Object.values(entities).some(entity => {
            if (entity.renderer && entity.y > -100) { // Check only for coins that are active on the screen
                const distanceX = Math.abs(entity.x - newX);
                const distanceY = Math.abs(entity.y - newY);
                return distanceX < 60 && distanceY < 60; // Adjust the distance as needed
            }
            return false;
        });
    }

    return (entities, {time}) => {
        if (entities.speedModifier === undefined || resetSignal) {
            entities.speedModifier = 0.1; // Start with a base speed
        } else {
            entities.speedModifier += 0.0005; // Gradual increase to make the game harder over time
        }

        Object.keys(entities).forEach(key => {
            if (key.startsWith("coin")) {
                let coin = entities[key];
                coin.y += (0.1 * entities.speedModifier) * time.delta;

                // Check if the coin has fallen off the screen
                if (coin.y > screenHeight) {
                    let newX, newY, tooClose;
                    do {
                        // Adjust newX calculation to prevent coins from being partially off-screen
                        newX = Math.random() * (screenWidth - coinWidth); // Ensure the entire coin is within the screen width
                        newY = -Math.random() * 100; // Ensure coins start off-screen, randomized to prevent immediate re-appearance
                        tooClose = isTooClose(newX, newY, entities);
                    } while (tooClose); // Keep generating a new position until it's not too close to any other coin

                    coin.x = newX;
                    coin.y = newY;
                    // Decrease a life since the coin has fallen off the screen without being caught
                    setLives(lives => Math.max(lives - 1, 0));
                }
            }
        });

        return entities;
    };
};

export default MoveCoin;
