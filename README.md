# Path finder visualizer using Dijkstra's algorithm

## How to use
1. Place a starting and ending point anywhere on the grid
2. Place obstacles along the way to block off paths
3. Click "Visualize" to see Dijkstra's Algorithm in motion

### Dijkstra's Algorithm
A weighted algorithm used to find the shortest path between two points by starting at a specified node and finding the shortest path to all other nodes in the grid one at a time. 
At each step, it selects the node with the shortest distance from the starting node and then updates the distances to its neighbours (in this case, neighbours for each node is up, down, left, right). 
The algorithm continues until it has found the shortest path to the end node in the grid, or if it has been completely blocked off, then the shortest path to all nodes that are not blocked by obstacles.
Examples of possible usage in real life: network routing protocols, gps navigation system

### Dijkstra's Algorithm Pseudo Code
1. Let distance of start node = 0
2. Let distance of all other nodes = infinity 
    a. set to infinity to state that we don't know the distance from start node to each node
    b. as we explore the grid, we update each node with the distance 

## Features to update, as of 13 Apr 2023: 
1. Update obstacles to be removed upon 2nd click (currently can be done by clicking clear maze)
2. If start/end point, do not allow obstacles to overwrite
3. Implement dynamic grid sizing from user's input 
4. On clear, stop running dijkstra's algorithm 
5. Add functionality to add weights for each grid
6. Add A* Pathfinding Algorithm 

