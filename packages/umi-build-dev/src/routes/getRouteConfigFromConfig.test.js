import getRoute from './getRouteConfigFromConfig';

describe('getRoutesConfigFromConfig', () => {
  it('normal', () => {
    const routes = getRoute([{ path: '/a' }]);
    expect(routes).toEqual([{ path: '/a', exact: true }]);
  });

  it("don't set exact if it' supplied", () => {
    const routes = getRoute([
      { path: '/a', exact: true },
      { path: '/b', exact: false },
    ]);
    expect(routes).toEqual([
      { path: '/a', exact: true },
      { path: '/b', exact: false },
    ]);
  });

  it("don't set exact if have routes", () => {
    const routes = getRoute([{ path: '/a' }, { path: '/b', routes: [] }]);
    expect(routes).toEqual([
      { path: '/a', exact: true },
      { path: '/b', routes: [] },
    ]);
  });

  it('throw error if not Array', () => {
    expect(() => {
      getRoute('a');
    }).toThrowError(/routes should be Array/);
  });

  it('throw error if child routes is not Array', () => {
    expect(() => {
      getRoute([{ path: '/', routes: 'a' }]);
    }).toThrowError(/routes should be Array/);
  });

  it('add pages prefix to component', () => {
    const routes = getRoute([
      { path: '/a', component: 'A' },
      {
        path: '/b',
        component: 'B',
        routes: [
          { path: '/b/c', component: 'C' },
          { path: '/b/d', component: 'D' },
        ],
      },
    ]);
    expect(routes).toEqual([
      { path: '/a', component: './src/pages/A', exact: true },
      {
        path: '/b',
        component: './src/pages/B',
        routes: [
          { path: '/b/c', component: './src/pages/C', exact: true },
          { path: '/b/d', component: './src/pages/D', exact: true },
        ],
      },
    ]);
  });

  it('relative redirect', () => {
    const routes = getRoute([
      { path: '/a' },
      {
        path: '/c',
        routes: [{ path: '/d', redirect: '/f' }, { path: '/e', redirect: 'e' }],
      },
    ]);
    expect(routes).toEqual([
      { path: '/a', exact: true },
      {
        path: '/c',
        routes: [
          { path: '/d', exact: true, redirect: '/f' },
          { path: '/e', exact: true, redirect: '/c/e' },
        ],
      },
    ]);
  });

  it('relative route path', () => {
    const routes = getRoute([
      { path: '/a' },
      { path: 'b' },
      {
        path: 'c',
        routes: [{ path: '/d' }, { path: 'e' }],
      },
    ]);
    expect(routes).toEqual([
      { path: '/a', exact: true },
      { path: '/b', exact: true },
      {
        path: '/c',
        routes: [{ path: '/d', exact: true }, { path: '/c/e', exact: true }],
      },
    ]);
  });

  it('customize pagesPath', () => {
    const routes = getRoute([{ path: '/a', component: 'A' }], 'src/new-pages');
    expect(routes).toEqual([
      { path: '/a', component: './src/new-pages/A', exact: true },
    ]);
  });

  it('bigfish compatibility', () => {
    const routes = getRoute([
      { path: '/a', indexRoute: { component: 'A' } },
      { path: '/b', indexRoute: { redirect: '/a' } },
      { path: '/c', childRoutes: [] },
    ]);
    expect(routes).toEqual([
      {
        path: '/a',
        routes: [{ path: '/a', component: './src/pages/A', exact: true }],
      },
      {
        path: '/b',
        routes: [{ path: '/b', exact: true, redirect: '/a' }],
      },
      { path: '/c', routes: [] },
    ]);
  });
});
