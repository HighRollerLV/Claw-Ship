// src/systems/MoveCoin.js
const MoveCoin = (entities, { time }) => {
    let newEntities = {};
    Object.keys(entities).forEach(key => {
        if (key.startsWith("coin")) {
            let coin = entities[key];
            coin.y += 0.1 * time.delta;
            newEntities[key] = coin;
        } else {
            newEntities[key] = entities[key];
        }
    });
    return newEntities;
};

export default MoveCoin;
