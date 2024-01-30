// src/systems/CollisionDetection.js
// src/systems/CollisionDetection.js
const CollisionDetection = (setScore, width) => (entities) => {
    const block = entities.block;
    Object.keys(entities).forEach(key => {
        if (key.startsWith("coin")) {
            const coin = entities[key];
            if (coin.x < block.x + block.width &&
                coin.x + coin.width > block.x &&
                coin.y < block.y + block.height &&
                coin.y + coin.height > block.y) {
                setScore(prevScore => prevScore + 1);
                // Reset coin position to a new random location
                let newX = Math.random() * width;
                let newY = -Math.random() * 500;

                // Check for NaN values
                coin.x = isNaN(newX) ? 0 : newX;
                coin.y = isNaN(newY) ? 0 : newY;
            }
        }
    });
    return entities;
};

export default CollisionDetection;

