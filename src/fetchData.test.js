import {
  getAccountId,
  getRapidViewId,
  addPointsByCategory,
  getStatusCategoryMap,
  getAssigneesFromIssues,
  getIssuesById,
  getAssigneesBySprint,
} from './fetchData';

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

test('getStatusCategoryMap', () => {
  expect(
    getStatusCategoryMap([
      {
        id: 104,
        mappedStatuses: [
          {
            id: '10200',
            statusCategory: { key: 'new' },
          },
          {
            id: '11004',
            statusCategory: { key: 'new' },
          },
          {
            id: '10600',
            statusCategory: { key: 'indeterminate' },
          },
          {
            id: '11005',
            statusCategory: { key: 'new' },
          },
        ],
      },
      {
        id: 105,
        mappedStatuses: [
          {
            id: '10401',
            statusCategory: { key: 'indeterminate' },
          },
          {
            id: '10300',
            statusCategory: { key: 'indeterminate' },
          },
        ],
      },
      {
        id: 134,
        mappedStatuses: [
          {
            id: '11704',
            statusCategory: { key: 'indeterminate' },
          },
        ],
      },
      {
        id: 109,
        mappedStatuses: [
          {
            id: '10501',
            statusCategory: { key: 'done' },
          },
        ],
      },
      {
        id: 111,
        mappedStatuses: [
          {
            id: '10201',
            statusCategory: { key: 'done' },
          },
          {
            id: '5',
            statusCategory: { key: 'done' },
          },
        ],
      },
    ])
  ).toEqual({
    '5': 'done',
    '10200': 'new',
    '10201': 'done',
    '10300': 'indeterminate',
    '10401': 'indeterminate',
    '10501': 'done',
    '10600': 'indeterminate',
    '11004': 'new',
    '11005': 'new',
    '11704': 'indeterminate',
  });
});

test('getAssigneesFromIssues', () => {
  expect(
    getAssigneesFromIssues([
      {
        assignee: 'danny.lin',
        assigneeName: 'Danny Lin',
        avatarUrl: 'https://dummyimage.com/48x48/000/fff',
      },
      {
        assignee: 'jenny.liang',
        assigneeName: 'Jenny Liang',
        avatarUrl: 'https://dummyimage.com/48x48/000/fff',
      },
      {
        assignee: 'jenny.liang',
        assigneeName: 'Jenny Liang',
        avatarUrl: 'https://dummyimage.com/48x48/000/fff',
      },
      {
        assignee: 'danny.lin',
        assigneeName: 'Danny Lin',
        avatarUrl: 'https://dummyimage.com/48x48/000/fff',
      },
      {
        assignee: 'danny.lin',
        assigneeName: 'Danny Lin',
        avatarUrl: 'https://dummyimage.com/48x48/000/fff',
      },
    ])
  ).toEqual({
    'danny.lin': {
      avatarUrl: 'https://dummyimage.com/48x48/000/fff',
      id: 'danny.lin',
      name: 'Danny Lin',
    },
    'jenny.liang': {
      avatarUrl: 'https://dummyimage.com/48x48/000/fff',
      id: 'jenny.liang',
      name: 'Jenny Liang',
    },
  });
});

test('getIssuesById', () => {
  expect(
    getIssuesById(
      [
        {
          id: 119305,
          assignee: 'danny.lin',
          estimateStatistic: { statFieldValue: { value: 0 } },
          statusId: '10201',
        },
        {
          id: 119306,
          assignee: 'jenny.liang',
          estimateStatistic: { statFieldValue: { value: 1 } },
          statusId: '10300',
        },
        {
          id: 112849,
          assignee: 'danny.lin',
          estimateStatistic: { statFieldValue: { value: 0.5 } },
          statusId: '10300',
        },
        {
          id: 91692,
          assignee: 'danny.lin',
          statusId: '10200',
        },
        {
          id: 113104,
          assignee: 'jenny.liang',
          estimateStatistic: { statFieldValue: { value: 2.5 } },
          statusId: '5',
        },
      ],
      {
        '5': 'done',
        '10200': 'new',
        '10201': 'done',
        '10300': 'indeterminate',
      }
    )
  ).toEqual({
    '112849': {
      assigneeId: 'danny.lin',
      points: 0.5,
      statusCategory: 'indeterminate',
    },
    '113104': {
      assigneeId: 'jenny.liang',
      points: 2.5,
      statusCategory: 'done',
    },
    '119305': { assigneeId: 'danny.lin', points: 0, statusCategory: 'done' },
    '119306': {
      assigneeId: 'jenny.liang',
      points: 1,
      statusCategory: 'indeterminate',
    },
    '91692': { assigneeId: 'danny.lin', points: 0, statusCategory: 'new' },
  });
});

test('getAssigneesBySprint', () => {
  expect(
    getAssigneesBySprint(
      {
        'jenny.liang': {
          avatarUrl: 'https://dummyimage.com/48x48/000/fff',
          id: 'jenny.liang',
          name: 'Jenny Liang',
        },
      },
      {
        '113104': {
          assigneeId: 'jenny.liang',
          points: 2.5,
          statusCategory: 'done',
        },
        '119306': {
          assigneeId: 'jenny.liang',
          points: 1,
          statusCategory: 'indeterminate',
        },
        '91692': { assigneeId: 'danny.lin', points: 0, statusCategory: 'new' },
      },
      ['113104', '119306']
    )
  ).toEqual({
    'jenny.liang': {
      avatarUrl: 'https://dummyimage.com/48x48/000/fff',
      id: 'jenny.liang',
      name: 'Jenny Liang',
    },
  });
});
