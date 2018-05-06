import formatNumber from './formatNumber';

test('formatNumber: 0 => "0"', () => {
  expect(formatNumber(0)).toBe('0');
});

test('formatNumber: 5 => "5"', () => {
  expect(formatNumber(5)).toBe('5');
});

test('formatNumber: 0.5 => "0.5"', () => {
  expect(formatNumber(0.5)).toBe('0.5');
});

test('formatNumber: 3.1415926 => "3.14"', () => {
  expect(formatNumber(3.1415926)).toBe('3.14');
});

test('formatNumber: 3.875 => "3.88"', () => {
  expect(formatNumber(3.875)).toBe('3.88');
});

test('formatNumber: 2.8000000000000003 => "2.8"', () => {
  expect(formatNumber(2.8000000000000003)).toBe('2.8');
});
