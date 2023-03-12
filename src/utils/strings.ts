export const toId = (input: string): string => {
  const matches = Array.from(
    input.toLowerCase()
      .replace('-', '_')
      .matchAll(/[a-z0-9_]+/g)
  );
  return matches.join('_').slice(0, 128);
}
