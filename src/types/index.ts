export type ScreenType = 
  | 'MAIN_MENU'
  | 'INSTRUCTIONS'
  | 'GAME'
  | 'GAMEOVER'
  | 'HIGH_SCORE';

export interface Entity {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  active: boolean;
}

export interface Player extends Entity {
  facingLeft: boolean;
  thrusting: boolean;
  invulnerableTimer: number;
}

export type EnemyType = 
  | 'LANDER'
  | 'MUTANT'
  | 'BOMBER'
  | 'INTERCEPTOR';

export interface LevelTheme {
  /** Background fill colour */
  skyColor: string;
  /** Main mountain/terrain stroke colour */
  terrainColor: string;
  /** Secondary mountain layer colour (parallax) */
  terrainColorAlt: string;
  /** Number of stars rendered */
  starCount: number;
  /** Terrain roughness multiplier */
  roughness: number;
  /** Terrain scale multiplier */
  scale: number;
}

export type LanderState = 
  | 'SEARCHING'
  | 'DESCENDING'
  | 'ABDUCTING'
  | 'ASCENDING';

export interface Enemy extends Entity {
  type: EnemyType;
  state?: LanderState;
  targetId?: string; // ID of targeted humanoid
  fireTimer: number;
  /** BOMBER only: countdown before next bomb drop */
  bombTimer?: number;
}

export type HumanoidState = 
  | 'ON_GROUND'
  | 'BEING_ABDUCTED'
  | 'FALLING'
  | 'DEAD';

export interface Humanoid extends Entity {
  state: HumanoidState;
  yVelocity: number;
  abductorId?: string; // ID of the Lander abducting it
}

export interface Bullet extends Entity {
  lifeTimer: number;
  isPlayerBullet: boolean;
}

export interface Particle extends Entity {
  lifeTimer: number;
  color: string;
  maxLife: number;
}

export interface HighScore {
  initials: string;
  score: number;
}
