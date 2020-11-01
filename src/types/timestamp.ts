export type Timestamp = [number, number];

export function now(): Timestamp {
  return millisToTimestamp(Date.now());
}

export function millisToTimestamp(millis: number): Timestamp {
  const secs = Math.floor(millis / 1000);
  const nanos = (millis % 1000) * 1000;
  return [secs, nanos];
}
