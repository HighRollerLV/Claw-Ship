let speedModifier = 1; // Initial speed modifier

const MoveCoin = (entities, { time }) => {
    let newEntities = {};
    // Increase the speed modifier over time
    speedModifier += 0.001; // Adjust this value to control how quickly the speed increases

    Object.keys(entities).forEach(key => {
        if (key.startsWith("coin")) {
            let coin = entities[key];
            // Apply the speed modifier to the coin's movement
            coin.y += (0.1 * speedModifier) * time.delta;
            newEntities[key] = coin;
        } else {
            newEntities[key] = entities[key];
        }
    });
    return newEntities;
};

export default MoveCoin;
