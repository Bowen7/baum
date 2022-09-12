import { greedyFAS } from './greedy';
import { Graph } from '../../graph';
describe('Greedy FAS', () => {
  it('it should break cycle', () => {
    const graph = new Graph(
      [{ id: '1' }, { id: '2' }],
      [
        { source: '1', target: '2', reversed: false },
        { source: '2', target: '1', reversed: false },
      ]
    );
    greedyFAS(graph);
    const expectedGraph = new Graph(
      [{ id: '1' }, { id: '2' }],
      [
        { source: '1', target: '2', reversed: true },
        { source: '2', target: '1', reversed: false },
      ]
    );
    expect(graph).toEqual(expectedGraph);
  });
});
