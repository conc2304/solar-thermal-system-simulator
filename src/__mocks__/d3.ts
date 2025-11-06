// Mock d3 for testing
export const scaleLinear = () => ({
  domain: () => ({ range: () => ({}) }),
  range: () => ({ domain: () => ({}) }),
});

export const line = () => ({
  x: () => line(),
  y: () => line(),
  curve: () => line(),
});

export const curveMonotoneX = {};

export const extent = (data: any[], accessor: (d: any) => any) => {
  if (!data || data.length === 0) return [0, 0];
  const values = data.map(accessor);
  return [Math.min(...values), Math.max(...values)];
};

export const select = () => ({
  selectAll: () => ({ remove: () => ({}) }),
  append: () => select(),
  attr: () => select(),
  style: () => select(),
});
