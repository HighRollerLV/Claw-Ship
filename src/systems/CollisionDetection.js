const CollisionDetection = (setScore, screenWidth) => (entities) => {
    Object.keys(entities).forEach(key => {
        if (key.startsWith("coin")) {
            const coin = entities[key];
            const block = entities.block;
            // Assuming this is your collision detection logic
            if (coin.x < block.x + block.width &&
                coin.x + coin.width > block.x &&
                coin.y < block.y + block.height &&
                coin.y + coin.height > block.y) {
                setScore(prevScore => prevScore + 1); // Increment score

                // Reposition the caught coin off-screen with a random x position
                coin.y = -Math.random() * 100; // Ensure it starts off-screen
                coin.x = Math.random() * screenWidth; // Randomize the x position
            }
        }
    });
    return entities;
};

export default CollisionDetection;


