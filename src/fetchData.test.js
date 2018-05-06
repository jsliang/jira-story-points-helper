import { getAccountId, getRapidViewId, addPointsByCategory } from './fetchData';

test('getAccountId: "test.atlassian.net" => "test"', () => {
  expect(getAccountId('test.atlassian.net')).toBe('test');
});

test('getAccountId: "" => ""', () => {
  expect(getAccountId('')).toBe('');
});

test('getRapidViewId: "?rapidView=42" => "42"', () => {
  expect(getRapidViewId('?rapidView=42')).toBe('42');
});

test('getRapidViewId: "?whatever=whatever" => ""', () => {
  expect(getRapidViewId('?whatever=whatever')).toBe(null);
});

test('addPointsByCategory #1', () => {
  expect(addPointsByCategory({}, 'indeterminate', 3)).toEqual({
    indeterminate: 3,
  });
});

test('addPointsByCategory #2', () => {
  expect(addPointsByCategory({ indeterminate: 3 }, 'indeterminate', 2)).toEqual(
    {
      indeterminate: 5,
    }
  );
});

test('addPointsByCategory #3', () => {
  expect(addPointsByCategory({ indeterminate: 3 }, 'new', 1)).toEqual({
    indeterminate: 3,
    new: 1,
  });
});

test('addPointsByCategory #4', () => {
  expect(addPointsByCategory({ new: 2.6, done: 0.5 }, 'done', 0.3)).toEqual({
    new: 2.6,
    done: 0.8,
  });
});
