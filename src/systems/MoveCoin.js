// MoveCoin function to handle coin movements and game mechanics
const MoveCoin = (screenWidth, screenHeight, setLives, resetSignal, coinWidth) => {
    // Defines a function to check if a new coin position is too close to any existing coins
    function isTooClose(newX, newY, entities) {
        // Iterates through all entities and checks for proximity
        return Object.values(entities).some(entity => {
            // Only considers entities that are coins and are currently on the screen
            if (entity.renderer && entity.y > -100) {
                // Calculates the distance between the existing entity and the new position
                const distanceX = Math.abs(entity.x - newX);
                const distanceY = Math.abs(entity.y - newY);
                // Returns true if the new position is within a certain distance threshold
                return distanceX < 60 && distanceY < 60;
            }
            return false;
        });
    }

    // The main logic for moving coins and adjusting game difficulty
    return (entities, {time}) => {
        // Resets or initializes the speed modifier for coin movement
        if (entities.speedModifier === undefined || resetSignal) {
            entities.speedModifier = 0.1; // Start with a base speed
        } else {
            // Gradually increases the speed over time to make the game harder
            entities.speedModifier += 0.0005;
        }

        // Iterates over each entity to move coins down the screen
        Object.keys(entities).forEach(key => {
            if (key.startsWith("coin")) { // Identifies coin entities
                let coin = entities[key];
                // Moves the coin based on the time delta and speed modifier
                coin.y += (0.1 * entities.speedModifier) * time.delta;

                // Checks if a coin has fallen off the screen
                if (coin.y > screenHeight) {
                    let newX, newY, tooClose;
                    do {
                        // Generates a new position for the coin, ensuring it's within screen bounds
                        newX = Math.random() * (screenWidth - coinWidth);
                        newY = -Math.random() * 100; // Start position off-screen
                        tooClose = isTooClose(newX, newY, entities); // Checks for proximity to other coins
                    } while (tooClose); // Repeats until a valid position is found

                    // Updates the coin's position
                    coin.x = newX;
                    coin.y = newY;
                    // Decreases a life for each coin that falls off the screen without being caught
                    setLives(lives => Math.max(lives - 1, 0));
                }
            }
        });

        return entities;
    };
};

export default MoveCoin;

