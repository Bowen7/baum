import { coffmanGraham } from './coffman-graham';
import { Graph } from '../../graph';
describe('Coffman-Graham', () => {
  it('test1', () => {
    const graph = new Graph(
      [
        { id: '0' },
        { id: '1' },
        { id: '2' },
        { id: '3' },
        { id: '4' },
        { id: '5' },
      ],
      [
        { source: '0', target: '1' },
        { source: '0', target: '2' },
        { source: '0', target: '4' },
        { source: '1', target: '3' },
        { source: '2', target: '3' },
        { source: '4', target: '5' },
      ]
    );
    coffmanGraham(graph, 2);
    const expectedRankMap = new Map([
      ['0', 0],
      ['1', 1],
      ['2', 2],
      ['3', 3],
      ['4', 1],
      ['5', 2],
    ]);
    expect(graph.rankMap).toEqual(expectedRankMap);
  });
});
