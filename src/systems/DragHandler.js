const DragHandler = (entities, {touches}) => {
    let start = touches.find(x => x.type === "start");
    let move = touches.find(x => x.type === "move");
    let end = touches.find(x => x.type === "end");

    if (start) {
        let block = entities.block;
        block.isDragging = true;
    }

    if (move) {
        let block = entities.block;
        if (block.isDragging) {
            // Update only the x coordinate
            block.x = move.event.pageX - block.width / 2;
            // Keep the y coordinate fixed
        }
    }

    if (end) {
        let block = entities.block;
        if (block.isDragging) {
            block.isDragging = false;
        }
    }

    return entities;
};

export default DragHandler;