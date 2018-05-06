import getTotalPoints from './getTotalPoints';

test('getTotalPoints: all zero', () => {
  expect(
    getTotalPoints({
      new: 0,
      indeterminate: 0,
      done: 0,
    })
  ).toBe(0);
});

test('getTotalPoints: all non-zero', () => {
  expect(
    getTotalPoints({
      new: 0.1,
      indeterminate: 0.2,
      done: 0.3,
    })
  ).toBeCloseTo(0.6, 1);
});

test('getTotalPoints: no `new`', () => {
  expect(
    getTotalPoints({
      indeterminate: 0.2,
      done: 0.3,
    })
  ).toBeCloseTo(0.5, 1);
});

test('getTotalPoints: no `indeterminate`', () => {
  expect(
    getTotalPoints({
      new: 0.1,
      done: 0.3,
    })
  ).toBeCloseTo(0.4, 1);
});

test('getTotalPoints: no `done`', () => {
  expect(
    getTotalPoints({
      new: 0.1,
      indeterminate: 0.2,
    })
  ).toBeCloseTo(0.3, 1);
});
