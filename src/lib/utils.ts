export function parseDuration(durationStr: string, defaultDuration?: number) {
  const convertToMs = (number: number, unit: string) => {
    switch (unit) {
      case 'ms':
        return number;
      case 's':
        return number * 1000;
      case 'm':
        return number * 1000 * 60;
      case 'h':
        return number * 1000 * 60 * 60;
      default:
        return defaultDuration || 5000;
    }
  };
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);

  if (!match || match.length !== 3) {
    return defaultDuration || 5000;
  }
  const number = Number(match[1]);
  const unit = match[2];

  return convertToMs(number, unit);
}
