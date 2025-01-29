const MAX_NAME_TO_SHOW = 25;

export const ellipsis = (name: string, limit = MAX_NAME_TO_SHOW): string => {
  const maybeDots = name.length > limit ? '...' : '';

  return name.slice(0, limit) + maybeDots;
}
