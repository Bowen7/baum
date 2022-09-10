import { memo } from 'react';
import { Box } from '../../types';
export type EdgeComponentProps = {
  source: string;
  target: string;
  sourceBox: Box;
  targetBox: Box;
};
export const EdgeComponent = memo((props: EdgeComponentProps) => {
  const { sourceBox, targetBox } = props;
  const startPoint = [
    sourceBox.x + sourceBox.width,
    sourceBox.y + sourceBox.height / 2,
  ];
  const endPoint = [targetBox.x, targetBox.y + targetBox.height / 2];
  return (
    <path
      d={`M ${startPoint[0]} ${startPoint[1]} L ${endPoint[0]} ${endPoint[1]}`}
    />
  );
});
