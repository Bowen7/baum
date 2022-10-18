import { greedyFAS } from './greedy';
import { Graph } from '../../graph';
describe('Greedy FAS', () => {
  it('it should break cycle', () => {
    const graph = new Graph(
      [{ id: '1' }, { id: '2' }],
      [
        { source: '1', target: '2' },
        { source: '2', target: '1' },
      ]
    );
    greedyFAS(graph);
    const expectedGraph = new Graph(
      [{ id: '1' }, { id: '2' }],
      [
        { source: '1', target: '2' },
        { source: '2', target: '1' },
      ]
    );
    expect(graph).toEqual(expectedGraph);
  });
});
