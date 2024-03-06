// Define a DragHandler function that is responsible for handling drag events.
const DragHandler = (entities, { touches }) => {
    // Find the first touch event where the touch type is "start".
    let start = touches.find(x => x.type === "start");
    // Find the first touch event where the touch type is "move".
    let move = touches.find(x => x.type === "move");
    // Find the first touch event where the touch type is "end".
    let end = touches.find(x => x.type === "end");

    // If a "start" event is found, initiate dragging.
    if (start) {
        // Access the block entity from the entities object.
        let block = entities.block;
        // Set the isDragging property of the block to true to indicate that dragging has started.
        block.isDragging = true;
    }

    // If a "move" event is found and the block is currently being dragged.
    if (move) {
        let block = entities.block;
        if (block.isDragging) {
            // Update the x position of the block to the current pageX position of the move event,
            // adjusted by half the block's width to center the block under the pointer.
            block.x = move.event.pageX - block.width / 2;
        }
    }

    // If an "end" event is found and the block is currently being dragged.
    if (end) {
        let block = entities.block;
        if (block.isDragging) {
            // Set the isDragging property of the block too false to indicate that dragging has ended.
            block.isDragging = false;
        }
    }

    return entities;
};

export default DragHandler;
