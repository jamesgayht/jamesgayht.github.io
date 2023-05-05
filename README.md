# Path finder visualizer using Dijkstra's algorithm

## How to use
1. Generate a grid based on your desired size
2. Place a starting and ending point anywhere on the grid
3. Place obstacles along the way to block off paths
4. Click "Visualize" to see Dijkstra's Algorithm in motion

### Dijkstra's Algorithm
A weighted algorithm used to find the shortest path between two points by starting at a specified node and finding the shortest path to all other nodes in the grid one at a time. 
At each step, it selects the node with the shortest distance from the starting node and then updates the distances to its neighbours (in this case, neighbours for each node is up, down, left, right). 
The algorithm continues until it has found the shortest path to the end node in the grid, or if it has been completely blocked off, then the shortest path to all nodes that are not blocked by obstacles.
Examples of possible usage in real life: network routing protocols, gps navigation system


