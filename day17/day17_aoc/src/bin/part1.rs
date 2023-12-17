#![allow(non_snake_case)]
use pathfinding::directed::dijkstra::dijkstra;

#[derive(Copy, Clone, Eq, PartialEq, Hash, Debug)]
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

#[derive(Copy, Clone, Eq, PartialEq, Hash, Debug)]
struct Pos {
  x: u32,
  y: u32,
}

#[derive(Copy, Clone, Eq, PartialEq, Hash, Debug)]
struct Node {
  pos: Pos,
  numMovesMadeInDirection: u32,
  directionFromPreviousNode: Direction,
}

// return new nodes that are possible successors to the given node
// and the cost of moving to that node
// (cost is the value of the grid at that position)
// if numMovesMadeInDirection is 3, then we can't move in that direction
fn successors(node: &Node, grid: &[Vec<u32>]) -> Vec<(Node, u32)> {
  let mut successors = Vec::new();

  // up
  if node.pos.y != 0 && node.directionFromPreviousNode != Direction::Down && !(node.directionFromPreviousNode == Direction::Up && node.numMovesMadeInDirection >= 3) {
    let newMovesMadeInDirection;
    if node.directionFromPreviousNode == Direction::Up {
      newMovesMadeInDirection = node.numMovesMadeInDirection + 1;
    } else {
      newMovesMadeInDirection = 1;
    }


    successors.push((
      Node{
        pos: Pos{x: node.pos.x, y: node.pos.y - 1},
        numMovesMadeInDirection: newMovesMadeInDirection,
        directionFromPreviousNode: Direction::Up,
      },
      grid[node.pos.y as usize - 1][node.pos.x as usize],
    ));
  }

  // down
  if node.pos.y != grid.len() as u32 - 1 && node.directionFromPreviousNode != Direction::Up && !(node.directionFromPreviousNode == Direction::Down && node.numMovesMadeInDirection >= 3) {
    let newMovesMadeInDirection;
    if node.directionFromPreviousNode == Direction::Down {
      newMovesMadeInDirection = node.numMovesMadeInDirection + 1;
    } else {
      newMovesMadeInDirection = 1;
    }

    successors.push((
      Node{
        pos: Pos{x: node.pos.x, y: node.pos.y + 1},
        numMovesMadeInDirection: newMovesMadeInDirection,
        directionFromPreviousNode: Direction::Down,
      },
      grid[node.pos.y as usize + 1][node.pos.x as usize],
    ));
  }

  // left
  if node.pos.x != 0 && node.directionFromPreviousNode != Direction::Right && !(node.directionFromPreviousNode == Direction::Left && node.numMovesMadeInDirection >= 3) {
    let newMovesMadeInDirection;
    if node.directionFromPreviousNode == Direction::Left {
      newMovesMadeInDirection = node.numMovesMadeInDirection + 1;
    } else {
      newMovesMadeInDirection = 1;
    }

    successors.push((
      Node{
        pos: Pos{x: node.pos.x - 1, y: node.pos.y},
        numMovesMadeInDirection: newMovesMadeInDirection,
        directionFromPreviousNode: Direction::Left,
      },
      grid[node.pos.y as usize][node.pos.x as usize - 1],
    ));
  }

  // right
  if node.pos.x != grid[0].len() as u32 - 1 && node.directionFromPreviousNode != Direction::Left && !(node.directionFromPreviousNode == Direction::Right && node.numMovesMadeInDirection >= 3) {
    let newMovesMadeInDirection;
    if node.directionFromPreviousNode == Direction::Right {
      newMovesMadeInDirection = node.numMovesMadeInDirection + 1;
    } else {
      newMovesMadeInDirection = 1;
    }

    successors.push((
      Node{
        pos: Pos{x: node.pos.x + 1, y: node.pos.y},
        numMovesMadeInDirection: newMovesMadeInDirection,
        directionFromPreviousNode: Direction::Right,
      },
      grid[node.pos.y as usize][node.pos.x as usize + 1],
    ));
  }
  successors
}

fn main () {
  let dayGrid = include_str!("../../puzzleInput.txt")
    .lines()
    .map(|line| line.chars().map(|c| c.to_digit(10).unwrap()).collect::<Vec<_>>())
    .collect::<Vec<_>>();

  let start = Node{pos: Pos{x: 0, y: 0}, numMovesMadeInDirection: 0, directionFromPreviousNode: Direction::Right};
  let end = Pos{x: dayGrid.len() as u32 - 1, y: dayGrid[0].len() as u32 - 1};

  let result = dijkstra(&start, |node|{
    successors(&node, &dayGrid)
  }, |node| {
    node.pos == end
  });

  if let Some((_, cost)) = result {
    println!("Part 1: {}", cost);
  } else {
    println!("Part 1: No path found");
  }
}