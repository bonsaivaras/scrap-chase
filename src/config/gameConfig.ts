interface GameConfig {
  CELL_SIZE: number;
  GAME_SPEED: number;
  SPEED_INCREASE_FACTOR: number;
  WIN_SCORE: number;
  MAX_OBSTACLES: number;
  OBSTACLES_PER_FOOD: number;
  INITIAL_OBSTACLES: number;
  INITIAL_SNAKE_POSITION: { x: number; y: number };
  INITIAL_DIRECTION: { x: number; y: number };
  GAME_TIME_SECONDS: number;
}

export const GAME_CONFIG: GameConfig = {
  CELL_SIZE: 20,
  GAME_SPEED: 80,
  SPEED_INCREASE_FACTOR: 3, // Speed increases by this many ms each time food is eaten
  WIN_SCORE: 10,
  MAX_OBSTACLES: 10,
  OBSTACLES_PER_FOOD: 1,
  INITIAL_OBSTACLES: 1,
  INITIAL_SNAKE_POSITION: { x: 10, y: 12 }, // Start below header
  INITIAL_DIRECTION: { x: 0, y: -1 }, // Start moving up
  GAME_TIME_SECONDS: 30, // 1 minute
} as const;

// Type for the config to ensure type safety
export type GameConfigType = typeof GAME_CONFIG;
