// Define a function for detecting collisions in a game environment.
// It requires functions to set the score, play a sound, and knows the screen width.
const CollisionDetection = (setScore, playPingSound, screenWidth) =>
    // Return a function that will process each game tick or frame, checking for collisions among entities.
    (entities) => {
        // Loop over each entity in the game. 'entities' is an object where keys are entity names.
        Object.keys(entities).forEach(key => {
            // Check if the current entity's key starts with "coin", indicating it's a coin object.
            if (key.startsWith("coin")) {
                const coin = entities[key]; // Get the coin object.
                const block = entities.block; // Assume there's a single block object for simplicity.

                // Collision detection logic:
                // Check if the coin's position intersects with the block's position.
                if (coin.x < block.x + block.width &&
                    coin.x + coin.width > block.x &&
                    coin.y < block.y + block.height &&
                    coin.y + coin.height > block.y) {
                    setScore(prevScore => prevScore + 1);
                    playPingSound(); // Play a sound to indicate the coin was collected

                    // Reposition the coin:
                    // Set the coin's y position off-screen upwards. This gives the appearance of respawning.
                    coin.y = -Math.random() * 100; // Randomize the starting y-position off-screen to avoid predictability

                    // Adjust the coin's x position to ensure it stays within the screen bounds.
                    // Subtract the coin's width from the screenWidth to prevent it from spawning partially off-screen.
                    coin.x = Math.random() * (screenWidth - coin.width);
                }
            }
        });

        // Return the possibly modified entities object back to the game loop.
        return entities;
    };

export default CollisionDetection;