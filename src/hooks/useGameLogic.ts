import { useCallback, useEffect, useState } from 'react';
import { GAME_CONFIG } from '../config/gameConfig';

interface Position {
  x: number;
  y: number;
}

const CAR_PARTS = [
  'Battery',
  'Engine',
  'Headlight',
  'Mirror',
  'Spring coil',
  'Steering wheel',
  'Turbo',
  'Wheel'
];

interface GameState {
  snake: Position[];
  direction: Position;
  food: Position;
  foodPart: string;
  obstacles: Position[];
  lastMoveTime?: number;
  movementProgress: number;
}

type GeneratePositionFn = () => Position;

export const useGameLogic = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  timeLeft: number,
  onGameOver: (score: number, reason: 'crash' | 'timeout', timeLeft?: number) => void,
  onWin: (score: number, timeLeft?: number) => void
) => {
  const calculateCellSize = useCallback((): number => {
    const canvas = canvasRef.current;
    if (!canvas) return GAME_CONFIG.CELL_SIZE;

    // We want roughly 40 cells horizontally to get ~20px cells
    const targetCellCount = 40;
    return Math.floor(canvas.width / targetCellCount);
  }, []);

  const getPlayableArea = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return { width: 800, height: 600, headerHeight: 0 };

    const cellSize = calculateCellSize();
    const headerHeight = Math.ceil(112 / cellSize); // Header height (24px + 64px + 24px)
    const totalWidth = Math.floor(canvas.width / cellSize);
    const totalHeight = Math.floor(canvas.height / cellSize);

    return {
      width: totalWidth,
      height: totalHeight - headerHeight,
      headerHeight
    };
  }, [calculateCellSize]);

  const [score, setScore] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(GAME_CONFIG.GAME_SPEED);
  const getRandomCarPart = () => {
    return CAR_PARTS[Math.floor(Math.random() * CAR_PARTS.length)];
  };

  const [gameState, setGameState] = useState<GameState>({
    snake: [GAME_CONFIG.INITIAL_SNAKE_POSITION],
    direction: GAME_CONFIG.INITIAL_DIRECTION,
    food: { x: 15, y: 15 },
    foodPart: getRandomCarPart(),
    obstacles: Array(GAME_CONFIG.INITIAL_OBSTACLES)
      .fill(null)
      .map(() => ({ x: 0, y: 0 })),
    lastMoveTime: Date.now(),
    movementProgress: 1
  });

  const generateRandomPosition: GeneratePositionFn = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.warn('Canvas not ready for position generation');
      return { x: 0, y: 0 };
    }

    const { width, height, headerHeight } = getPlayableArea();

    // Try to find a free position
    for (let attempts = 0; attempts < 100; attempts++) {
      // For 3x3 obstacles, we need to ensure there's room for the full obstacle
      const position = {
        x: Math.floor(Math.random() * (width - 3)), // Subtract 3 to leave room for 3x3 obstacle
        y: headerHeight + Math.floor(Math.random() * (height - 3)) // Subtract 3 to leave room for 3x3 obstacle
      };

      // For obstacles, we need to check if a 3x3 grid space is free
      const obstaclePositions = [
        position,
        { x: position.x + 1, y: position.y },
        { x: position.x + 2, y: position.y },
        { x: position.x, y: position.y + 1 },
        { x: position.x + 1, y: position.y + 1 },
        { x: position.x + 2, y: position.y + 1 },
        { x: position.x, y: position.y + 2 },
        { x: position.x + 1, y: position.y + 2 },
        { x: position.x + 2, y: position.y + 2 }
      ];

      // Check if all positions are within bounds
      const isWithinBounds = obstaclePositions.every(pos => 
        pos.x < width && pos.y < (height + headerHeight)
      );

      if (!isWithinBounds) continue;

      // Check if any position is occupied
      const isOccupied = obstaclePositions.some(pos => 
        gameState.snake.some(segment => segment.x === pos.x && segment.y === pos.y) ||
        gameState.obstacles.some(obstacle => 
          [
            obstacle,
            { x: obstacle.x + 1, y: obstacle.y },
            { x: obstacle.x + 2, y: obstacle.y },
            { x: obstacle.x, y: obstacle.y + 1 },
            { x: obstacle.x + 1, y: obstacle.y + 1 },
            { x: obstacle.x + 2, y: obstacle.y + 1 },
            { x: obstacle.x, y: obstacle.y + 2 },
            { x: obstacle.x + 1, y: obstacle.y + 2 },
            { x: obstacle.x + 2, y: obstacle.y + 2 }
          ].some(obsPos => obsPos.x === pos.x && obsPos.y === pos.y)
        ) ||
        [
          gameState.food,
          { x: gameState.food.x + 1, y: gameState.food.y },
          { x: gameState.food.x + 2, y: gameState.food.y },
          { x: gameState.food.x, y: gameState.food.y + 1 },
          { x: gameState.food.x + 1, y: gameState.food.y + 1 },
          { x: gameState.food.x + 2, y: gameState.food.y + 1 },
          { x: gameState.food.x, y: gameState.food.y + 2 },
          { x: gameState.food.x + 1, y: gameState.food.y + 2 },
          { x: gameState.food.x + 2, y: gameState.food.y + 2 }
        ].some(foodPos => foodPos.x === pos.x && foodPos.y === pos.y)
      );

      if (!isOccupied) {
        console.log('Generated valid position:', position);
        return position;
      }
    }

    console.warn('Could not find free position after 100 attempts');
    // Emergency fallback: try edges of the grid
    const fallbackPositions = [
      { x: 0, y: headerHeight },
      { x: width - 3, y: headerHeight }, // -3 to ensure 3x3 obstacle fits
      { x: 0, y: height + headerHeight - 3 }, // -3 to ensure 3x3 obstacle fits
      { x: width - 3, y: height + headerHeight - 3 } // -3 to ensure 3x3 obstacle fits
    ];

    for (const pos of fallbackPositions) {
      const isOccupied = 
        gameState.snake.some(segment => segment.x === pos.x && segment.y === pos.y) ||
        gameState.obstacles.some(obstacle => obstacle.x === pos.x && obstacle.y === pos.y);
      
      if (!isOccupied) {
        console.log('Using fallback position:', pos);
        return pos;
      }
    }

    // Last resort: return center of playable area
    const lastResort = {
      x: Math.floor(width / 2) - 1, // -1 to ensure 3x3 obstacle fits
      y: Math.floor(height / 2) + headerHeight - 1 // -1 to ensure 3x3 obstacle fits
    };
    console.warn('Using last resort position:', lastResort);
    return lastResort;
  }, [calculateCellSize, gameState]);

  // Load bus stop image once
  const [busStopImage] = useState(() => {
    const img = new Image();
    img.src = new URL('../assets/bus-stop.png', import.meta.url).href;
    return img;
  });

  // Load car image and car part images
  const [carImage] = useState(() => {
    const img = new Image();
    img.src = new URL('../assets/car.png', import.meta.url).href;
    return img;
  });

  // Load car part images
  const [carPartImages] = useState(() => {
    return CAR_PARTS.reduce((acc, part) => {
      const img = new Image();
      img.src = new URL(`../assets/Property 1=${part}.png`, import.meta.url).href;
      acc[part] = img;
      return acc;
    }, {} as Record<string, HTMLImageElement>);
  });

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvas === null) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Enable high-quality image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cellSize = calculateCellSize();
    
    // Draw snake trail and car head
    gameState.snake.forEach((segment, index) => {
      if (index === 0 && carImage) {
        // Draw car head
        ctx.save();
        ctx.translate(segment.x * cellSize + cellSize / 2, segment.y * cellSize + cellSize);
        
        // Initial rotation to make car face up
        ctx.rotate(Math.PI);
        
        // Rotate based on direction
        let rotation = 0;
        if (gameState.direction.x === 1) rotation = Math.PI / 2;
        else if (gameState.direction.x === -1) rotation = -Math.PI / 2;
        else if (gameState.direction.y === 1) rotation = Math.PI;
        else if (gameState.direction.y === -1) rotation = 0;
        ctx.rotate(rotation);
        
        ctx.drawImage(carImage, -cellSize / 2, -cellSize, cellSize, cellSize * 2);
        ctx.restore();
      } else {
        // Draw trail for body segments
        ctx.save();
        ctx.translate(segment.x * cellSize + cellSize / 2, segment.y * cellSize + cellSize);
        
        // Initial rotation to make trail face up
        ctx.rotate(Math.PI);
        
        // Rotate based on direction
        let rotation = 0;
        if (gameState.direction.x === 1) rotation = Math.PI / 2;
        else if (gameState.direction.x === -1) rotation = -Math.PI / 2;
        else if (gameState.direction.y === 1) rotation = Math.PI;
        else if (gameState.direction.y === -1) rotation = 0;
        ctx.rotate(rotation);
        
        // Draw rotated trail
        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        ctx.fillRect(-cellSize / 2, -cellSize, cellSize, cellSize * 2);
        ctx.restore();
      }
    });

    // Draw food (car part) - 3x3 grid size
    const foodImage = carPartImages[gameState.foodPart];
    if (foodImage) {
      ctx.drawImage(
        foodImage,
        gameState.food.x * cellSize,
        gameState.food.y * cellSize,
        cellSize * 3,
        cellSize * 3
      );
    }

    // Draw obstacles as bus stop images
    gameState.obstacles.forEach(obstacle => {
      // Draw 3x3 sized image for each obstacle
      ctx.drawImage(
        busStopImage,
        obstacle.x * cellSize,
        obstacle.y * cellSize,
        cellSize * 3, // Width of 3 cells
        cellSize * 3  // Height of 3 cells
      );
    });
  }, [gameState]);

  const moveSnake = useCallback(() => {
    const newSnake = [...gameState.snake];
    const cellSize = calculateCellSize();
    const gridWidth = Math.floor(canvasRef.current!.width / cellSize);
    const gridHeight = Math.floor(canvasRef.current!.height / cellSize);
    
    // Calculate next position
    let nextX = newSnake[0].x + gameState.direction.x;
    let nextY = newSnake[0].y + gameState.direction.y;
    
    // Wrap around walls
    if (nextX < 0) nextX = gridWidth - 1;
    if (nextX >= gridWidth) nextX = 0;
    if (nextY < 0) nextY = gridHeight - 1;
    if (nextY >= gridHeight) nextY = 0;
    
    const head = { x: nextX, y: nextY };

    // Check obstacle collision (3x3 grid)
    if (gameState.obstacles.some(obstacle => {
      const positions = [
        obstacle,
        { x: obstacle.x + 1, y: obstacle.y },
        { x: obstacle.x + 2, y: obstacle.y },
        { x: obstacle.x, y: obstacle.y + 1 },
        { x: obstacle.x + 1, y: obstacle.y + 1 },
        { x: obstacle.x + 2, y: obstacle.y + 1 },
        { x: obstacle.x, y: obstacle.y + 2 },
        { x: obstacle.x + 1, y: obstacle.y + 2 },
        { x: obstacle.x + 2, y: obstacle.y + 2 }
      ];
      return positions.some(pos => pos.x === head.x && pos.y === head.y);
    })) {
      onGameOver(score, 'crash', timeLeft);
      return;
    }

    // Check self collision
    if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
      onGameOver(score, 'crash', timeLeft);
      return;
    }

    newSnake.unshift(head);

    // Check if food is eaten (3x3 grid)
    const foodPositions = [
      gameState.food,
      { x: gameState.food.x + 1, y: gameState.food.y },
      { x: gameState.food.x + 2, y: gameState.food.y },
      { x: gameState.food.x, y: gameState.food.y + 1 },
      { x: gameState.food.x + 1, y: gameState.food.y + 1 },
      { x: gameState.food.x + 2, y: gameState.food.y + 1 },
      { x: gameState.food.x, y: gameState.food.y + 2 },
      { x: gameState.food.x + 1, y: gameState.food.y + 2 },
      { x: gameState.food.x + 2, y: gameState.food.y + 2 }
    ];
    
    if (foodPositions.some(pos => pos.x === head.x && pos.y === head.y)) {
      setScore(prev => {
        const newScore = prev + 1;
        if (newScore >= GAME_CONFIG.WIN_SCORE) {
          onWin(newScore, timeLeft);
        }
        return newScore;
      });

      // Increase game speed
      setGameSpeed(prev => Math.max(30, prev - GAME_CONFIG.SPEED_INCREASE_FACTOR)); // Minimum speed of 30ms

      // Generate new food and obstacles
      console.log('Generating new food after collection');
      const newFood = generateRandomPosition();
      const newFoodPart = getRandomCarPart();
      console.log('New food position:', newFood, 'part:', newFoodPart);
      
      const newObstacles = Array(GAME_CONFIG.OBSTACLES_PER_FOOD)
        .fill(null)
        .map(() => generateRandomPosition());
      console.log('New obstacles:', newObstacles);
      
      setGameState(prev => {
        const updatedState = {
          ...prev,
          food: newFood,
          foodPart: newFoodPart,
          obstacles: [...prev.obstacles, ...newObstacles].slice(0, GAME_CONFIG.MAX_OBSTACLES)
        };
        console.log('Updated game state:', updatedState);
        return updatedState;
      });
      
      // Verify food was set
      setTimeout(() => {
        console.log('Current game state after update:', gameState);
      }, 0);
    } else {
      newSnake.pop();
    }

    setGameState(prev => ({
      ...prev,
      snake: newSnake
    }));
  }, [gameState, score, timeLeft]);



  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    const directions: { [key: string]: Position } = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 }
    };

    if (directions[e.key]) {
      setGameState(prev => ({
        ...prev,
        direction: directions[e.key]
      }));
    }
  }, []);

  const initGame = useCallback(() => {
    setScore(0);
    setGameSpeed(GAME_CONFIG.GAME_SPEED); // Reset to initial speed
    setGameState({
      snake: [GAME_CONFIG.INITIAL_SNAKE_POSITION],
      direction: GAME_CONFIG.INITIAL_DIRECTION,
      food: generateRandomPosition(),
      foodPart: getRandomCarPart(),
      obstacles: Array(GAME_CONFIG.INITIAL_OBSTACLES)
        .fill(null)
        .map(() => generateRandomPosition()),
      lastMoveTime: Date.now(),
      movementProgress: 1
    });

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onGameOver(score, 'timeout', timeLeft);
      return;
    }

    const gameLoop = setInterval(() => {
      moveSnake();
      drawGame();
    }, gameSpeed);

    return () => clearInterval(gameLoop);
  }, [gameState, timeLeft, moveSnake, drawGame]);

  return {
    score,
    gameState,
    initGame
  };
};
