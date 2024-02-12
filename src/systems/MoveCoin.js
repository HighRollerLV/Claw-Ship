const MoveCoin = (screenWidth, screenHeight, setLives, resetSignal) => (entities, {time}) => {
    // Check for a reset signal to reset speedModifier to its default
    if (entities.speedModifier === undefined || resetSignal) {
        entities.speedModifier = 0.2; // Start slower
    } else {
        entities.speedModifier += 0.0005; // Increase speed more gradually
    }

    // Define the isTooClose function inside MoveCoin to ensure it has access to the current entities
    function isTooClose(newX, newY, entities) {
        return Object.values(entities).some(entity => {
            if (entity.renderer && entity.y > -100) { // Check only for coins that are currently active on the screen
                const distanceX = Math.abs(entity.x - newX);
                const distanceY = Math.abs(entity.y - newY);
                return distanceX < 60 && distanceY < 60; // Assuming a minimum distance to avoid overlap
            }
            return false;
        });
    }

    Object.keys(entities).forEach(key => {
        if (key.startsWith("coin")) {
            let coin = entities[key];
            coin.y += (0.1 * entities.speedModifier) * time.delta;

            // Check if the coin has fallen off the screen
            if (coin.y > screenHeight) {
                let newX, newY, tooClose;
                do {
                    newX = Math.random() * screenWidth;
                    newY = -50; // Reset coin position to start off-screen
                    tooClose = isTooClose(newX, newY, entities);
                } while (tooClose); // Keep generating a new position until it's not too close to any other coin

                coin.y = newY;
                coin.x = newX;
                setLives(lives => lives - 1); // Decrease a life
            }
        }
    });

    return entities;
};

export default MoveCoin;
