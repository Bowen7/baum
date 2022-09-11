import { bergerShorFAS } from './berger-shor';
import { Graph } from '../../graph';
describe('Berger-Shor FAS', () => {
  it('it should break cycle', () => {
    const graph = new Graph(
      [{ id: '1' }, { id: '2' }],
      [
        { source: '1', target: '2', reversed: false },
        { source: '2', target: '1', reversed: false },
      ]
    );
    bergerShorFAS(graph);
    const expectedGraph = new Graph(
      [{ id: '1' }, { id: '2' }],
      [
        { source: '1', target: '2', reversed: false },
        { source: '2', target: '1', reversed: true },
      ]
    );
    expect(graph).toEqual(expectedGraph);
  });
});
