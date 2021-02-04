# MARS_ROVER-_SOLUTION
HTML, CSS and Javascript


## Assumptions and Design

#### Assumptions:
 - The rover should always be on the Plateau, which means all the rover can't moved out of Plateau.
    For example we have the Plateau as (5, 5). One Rover is at (3, 3, N) and its instructions is 'MMMMMRMM'.
    After it executed the second instruction, it will be at (3, 5, N) and the left instruction is 'MMMRMM'.
    Now it can't move forward N anymore. So the following "M" before "R" will be skipped, 
    the rest available instruction will be 'RMM'. So its finally locations will be (5, 5, E).
 
 - The rover can't be moved to overlap on previous rovers, which means when we have two rovers [(0, 1, N), (0, 0, N)],
  we can't move the second rover, because there is already one rover at (0, 1) already.
   This instruction will be skipped like before.  

Basically I used OO design for 3 classes:

- Plateau - Used to limit how far away the rovers can move to. It has no idea of rovers.

- Rover - Rover can turn left, turn right and move forward one step. One rover has no idea of other rover nor plateau. 

- Controller - It's used to
    - connect Plateau and Rovers
    
    - format, trim, validate, parse input instructions
    
    - Check if a rover move instruction can be executed, which means a rover can't move out of plateau, nor move to overlap
    on another rover. Controller will skip these wrong instructions, however it will still do the rest commands
    
    - Print the information of Rovers  

### Error handle:
When there is input error(the coordinate is negative or decimal, and etc) or logic error(rover was deployed out plateau, and etc.)
The code will throw error.


INPUT:
The first line of input is the upper-right coordinates of the plateau, the lower-left coordinates are assumed to be 0,0.
The rest of the input is information pertaining to the rovers that have been deployed. Each rover has input delimited by |. The first part gives the rover's position, and the second part is a series of instructions telling the rover how to explore the plateau.
The position is made up of two integers and a letter separated by spaces, corresponding to the x and y co-ordinates and the rover's orientation.
Each rover will be finished sequentially, which means that the second rover won't start to move until the first one has finished moving.

OUTPUT
The output for each rover should be its final co-ordinates and heading.

INPUT AND OUTPUT
Test Input:
55
1 2 N|LMLMLMLMM 
3 3 E|MMRMMRMRRM
Expected Output: 
1 3 N
5 1 E 



