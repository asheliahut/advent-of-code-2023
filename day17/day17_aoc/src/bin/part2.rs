#![allow(non_snake_case)]
use pathfinding::directed::dijkstra::dijkstra;

#[derive(Copy, Clone, Eq, PartialEq, Hash, Debug)]
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

impl Direction {
  fn opposite(&self) -> Direction {
    match self {
      Direction::Up => Direction::Down,
      Direction::Down => Direction::Up,
      Direction::Left => Direction::Right,
      Direction::Right => Direction::Left,
    }
  }
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


fn moveInDirection(node: &Node, grid: &[Vec<u32>], dir: Direction) -> Option<(Node, u32)> {
  let mut newMovesMadeInDirection = node.numMovesMadeInDirection;
  if node.directionFromPreviousNode == dir {
    newMovesMadeInDirection += 1;
  } else {
    newMovesMadeInDirection = 1;
  }

  if dir.opposite() == node.directionFromPreviousNode {
    return None;
  }

  if node.directionFromPreviousNode == dir && newMovesMadeInDirection > 10 {
    return None;
  }

  if (node.pos.x == 0 && dir == Direction::Left) || (node.pos.y == 0 && dir == Direction::Up) {
    return None;
  }

  if node.directionFromPreviousNode != dir && node.numMovesMadeInDirection < 4 {
    return None;
  }

  let newPos = match dir {
    Direction::Up => Pos{x: node.pos.x, y: node.pos.y - 1},
    Direction::Down => Pos{x: node.pos.x, y: node.pos.y + 1},
    Direction::Left => Pos{x: node.pos.x - 1, y: node.pos.y},
    Direction::Right => Pos{x: node.pos.x + 1, y: node.pos.y},
  };

  if newPos.x >= grid[0].len() as u32 || newPos.y >= grid.len() as u32 {
    return None;
  }

  Some((
    Node{
      pos: newPos,
      numMovesMadeInDirection: newMovesMadeInDirection,
      directionFromPreviousNode: dir,
    },
    grid[newPos.y as usize][newPos.x as usize],
  ))
}


// return new nodes that are possible successors to the given node
// and the cost of moving to that node
// (cost is the value of the grid at that position)
// if numMovesMadeInDirection is 3, then we can't move in that direction
fn successors(node: &Node, grid: &[Vec<u32>]) -> Vec<(Node, u32)> {
  [
    moveInDirection(node, grid, Direction::Up),
    moveInDirection(node, grid, Direction::Down),
    moveInDirection(node, grid, Direction::Left),
    moveInDirection(node, grid, Direction::Right),
  ].into_iter().flatten().collect()
}

fn main () {
  let dayGrid = include_str!("../../puzzleInput.txt")
    .lines()
    .map(|line| line.chars().map(|c| c.to_digit(10).unwrap()).collect::<Vec<_>>())
    .collect::<Vec<_>>();

  let start = Node{pos: Pos{x: 0, y: 0}, numMovesMadeInDirection: 0, directionFromPreviousNode: Direction::Right};
  let end = Pos{x: dayGrid[0].len() as u32 - 1, y: dayGrid.len() as u32 - 1};

  let result = dijkstra(&start, |node|{
    successors(&node, &dayGrid)
  }, |node| {
    node.pos == end && node.numMovesMadeInDirection >= 4
  });

  if let Some((_, cost)) = result {
    println!("Part 2: {}", cost);
  } else {
    println!("Part 2: No path found");
  }
}