export const toProperCase = (text) => {
  if (!text) return text;
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const toUpperCase = (text) => {
  if (!text) return text;
  return text.toUpperCase();
};
