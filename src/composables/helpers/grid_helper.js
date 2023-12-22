const gridSize = 3;

export const getPosition = (point) => {
    point.x = Math.round(point.x / gridSize) * gridSize;
    point.z = Math.round(point.z / gridSize) * gridSize;
    return point;
}
