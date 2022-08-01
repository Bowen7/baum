import { memo } from 'react';
import { getBoxToBoxArrow } from 'perfect-arrows';
type NdTreeBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Props = {
  startBox: NdTreeBox;
  endBox: NdTreeBox;
};

export const NdTreePerfectArrows = memo((props: Props) => {
  const { startBox, endBox } = props;
  const arrow = getBoxToBoxArrow(
    startBox.x,
    startBox.y,
    startBox.width,
    startBox.height,
    endBox.x,
    endBox.y,
    endBox.width,
    endBox.height,
    {
      bow: 0.15,
      stretch: 0,
      stretchMin: 0,
      stretchMax: 3180,
      padStart: 0,
      padEnd: 8,
      flip: false,
      straights: true,
    }
  );
  const [sx, sy, cx, cy, ex, ey, ae] = arrow;
  const endAngleAsDegrees = ae * (180 / Math.PI);
  return (
    <>
      <path d={`M${sx},${sy} Q${cx},${cy} ${ex},${ey}`} fill="none" />
      <polygon
        points="0,-3 6,0, 0,3"
        transform={`translate(${ex},${ey}) rotate(${endAngleAsDegrees})`}
      />
    </>
  );
});
