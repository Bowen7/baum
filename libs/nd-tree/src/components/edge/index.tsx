import { memo } from 'react';
import { Box } from '../../types';
export type EdgeComponentProps = {
  start: Box;
  end: Box;
};
export const EdgeComponent = memo((props: EdgeComponentProps) => {
  const { start, end } = props;
  const startPoint = [start.x + start.width, start.y + start.height / 2];
  const endPoint = [end.x, end.y + end.height / 2];
  return (
    <path
      d={`M ${startPoint[0]} ${startPoint[1]} L ${endPoint[0]} ${endPoint[1]}`}
    />
  );
});
