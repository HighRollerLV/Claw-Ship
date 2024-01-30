// src/systems/CollisionDetection.js
const CollisionDetection = (setScore) => (entities) => {
    const block = entities.block;
    Object.keys(entities).forEach(key => {
        if (key.startsWith("coin")) {
            const coin = entities[key];
            if (coin.x < block.x + block.width &&
                coin.x + coin.width > block.x &&
                coin.y < block.y + block.height &&
                coin.y + coin.height > block.y) {
                setScore(prevScore => prevScore + 1);
                coin.y = -1000;
            }
        }
    });
    return entities;
};

export default CollisionDetection;
