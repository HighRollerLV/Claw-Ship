const CollisionDetection = (setScore, screenWidth) => (entities) => {
    Object.keys(entities).forEach(key => {
        if (key.startsWith("coin")) {
            const coin = entities[key];
            const block = entities.block;
            if (coin.x < block.x + block.width &&
                coin.x + coin.width > block.x &&
                coin.y < block.y + block.height &&
                coin.y + coin.height > block.y) {
                setScore(prevScore => prevScore + 1); // Increment score

                // Ensure the coin is fully within the screen when repositioned
                coin.y = -Math.random() * 100; // Ensure it starts off-screen

                // Adjusted to prevent coins from partially appearing off-screen
                coin.x = Math.random() * (screenWidth - coin.width); // Subtract coin width from screenWidth
            }
        }
    });
    return entities;
};


export default CollisionDetection;


