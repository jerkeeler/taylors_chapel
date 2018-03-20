import { TOKEN_LENGTH, TOKEN_CHARS } from './consts';

export function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

export function randomRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export function getRandomEl(arr: Array<any>): any {
  return arr[randomInt(arr.length)];
}

export function randomToken(tokenLength = TOKEN_LENGTH): string {
  const arr = Array(tokenLength).fill(0).map(_ => 't');
  return Array(tokenLength).fill(0).map(_ => getRandomEl(TOKEN_CHARS)).join('');
}
