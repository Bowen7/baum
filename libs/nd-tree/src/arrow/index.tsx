import { memo } from 'react';
export type NdTreeBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};
export type ArrowProps = {
  startBox: NdTreeBox;
  endBox: NdTreeBox;
};
export const Arrow = memo((props: ArrowProps) => {
  const { startBox, endBox } = props;
  const start = [startBox.x + startBox.width, startBox.y + startBox.height / 2];
  const end = [endBox.x, endBox.y + endBox.height / 2];
  return (
    <path
      d={`M ${start[0]} ${start[1]} L ${end[0]} ${end[1]}`}
      stroke="#000"
      strokeWidth={2}
    />
  );
});
