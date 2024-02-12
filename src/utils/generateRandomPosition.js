// src/utils/positionUtils.js
export function generateRandomPosition(previousPositions, screenWidth, screenHeight, minimumDistance = 60) {
    let x, y, tooClose;
    do {
        x = Math.random() * (screenWidth - 20);
        y = -Math.random() * 500;
        tooClose = previousPositions.some(pos => Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2)) < minimumDistance);
    } while (tooClose);
    return { x, y };
}
