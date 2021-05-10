# Tic-Tac-Toe using Minimax Algorithm
I tried building an unbeatable Tic Tac Toe game with a reliable Artificial Intelligence.

## Abstract
**Minimax is a decision rule used in artificial intelligence, decision theory, game theory, statistics, and philosophy for minimizing the possible loss for a worst case scenario. When dealing with gains, it is referred to as "maximin"—to maximize the minimum gain.**

In algorithms, **minimax** is a recursive program written to find the best gameplay that minimizes any tendency to lose a game while maximizing any opportunity to win the game.

![](https://github.com/IdealisticINTJ/Tic-Tac-Toe_Minimax-algorithm/blob/main/ALGO.png)

## Algorithm explanation

A Minimax algorithm can be best defined as a recursive function that does the following things:

- Return a value if a terminal state is found (+10, 0, -10)
- Go through available spots on the board
- Call the minimax function on each available spot (recursion)
- Evaluate returning values from function calls
- Return the best value

~> This algorithm sees a few steps ahead and puts itself in the shoes of its opponent. It keeps playing ahead until it reaches a terminal arrangement of the board (terminal state) resulting in a tie, a win, or a loss. 
Once in a terminal state, the AI will assign an arbitrary positive score (+10) for a win, a negative score (-10) for a loss, or a neutral score (0) for a tie. 
 
~> At the same time, the algorithm evaluates the moves that lead to a terminal state based on the players’ turn. It will choose the move with maximum score when it is the AI’s turn and choose the move with the minimum score when it is the human player’s turn. 
Using this strategy, Minimax avoids losing to the human player.

## Pseudocode
~~~~
function minimax(node, depth, maximizingPlayer) is
    if depth = 0 or node is a terminal node then
        return the heuristic value of node
    if maximizingPlayer then
        value := −∞
        for each child of node do
            value := max(value, minimax(child, depth − 1, FALSE))
        return value
    else (* minimizing player *)
        value := +∞
        for each child of node do
            value := min(value, minimax(child, depth − 1, TRUE))
        return value
   ~~~~
             
        
## References
~> Minimax algorithm ~ [Wikipedia](https://en.wikipedia.org/wiki/Minimax#Minimax_algorithm_with_alternate_moves) 

~> Guide to making your Tic Tac Toe game unbeatable by using the **Minimax Algorithm** ~ [freeCodeCamp](https://www.freecodecamp.org/news/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37/)
