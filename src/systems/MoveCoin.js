const MoveCoin = (screenWidth, screenHeight, setLives, resetSignal, coinWidth) => {
    const maxX = screenWidth - coinWidth;
    const maxY = -100;

    function isTooClose(newX, newY, entities) {
        return Object.values(entities).some(entity => {
            if (entity.renderer && entity.y > maxY) {
                const distanceX = Math.abs(entity.x - newX);
                const distanceY = Math.abs(entity.y - newY);
                return distanceX < 60 && distanceY < 60;
            }
            return false;
        });
    }

    return (entities, { time }) => {
        if (entities.speedModifier === undefined || resetSignal) {
            entities.speedModifier = 0.1;
        } else {
            entities.speedModifier += 0.0005;
        }

        Object.keys(entities).forEach(key => {
            if (key.startsWith("coin")) {
                let coin = entities[key];
                coin.y += (0.1 * entities.speedModifier) * time.delta;

                if (coin.y > screenHeight) {
                    let newX, newY, tooClose;
                    do {
                        newX = Math.random() * maxX;
                        newY = maxY * Math.random();
                        tooClose = isTooClose(newX, newY, entities);
                    } while (tooClose);

                    coin.x = newX;
                    coin.y = newY;
                    setLives(lives => Math.max(lives - 1, 0));
                }
            }
        });

        return entities;
    };
};

export default MoveCoin;

