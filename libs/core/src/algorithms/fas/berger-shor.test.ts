import { bergerShorFAS } from './berger-shor';
import { Graph } from '../../graph';
describe('Berger-Shor FAS', () => {
  it('it should break cycle', () => {
    const graph = new Graph(
      [{ id: '1' }, { id: '2' }],
      [
        { source: '1', target: '2' },
        { source: '2', target: '1' },
      ]
    );
    bergerShorFAS(graph);
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
