export function logger(message: string, color: string = 'white') {
  console.log(`%c ${message}`, `background: ${color}; color: black; padding: 6px 8px`);
}
