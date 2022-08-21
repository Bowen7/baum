import { useEffect, useRef, memo } from 'react';
import { Size } from '../../types';
type NodeComponentProps<T = {}> = T & {
  x: number;
  y: number;
  label?: string;
  onResize?: (size: Size) => void;
};

export const DefaultNodeComponent = memo((props: NodeComponentProps) => {
  const { label, onResize } = props;
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current && onResize) {
      const { width, height } = ref.current.getBoundingClientRect();
      onResize([width, height]);
    }
  }, []);
  return <div ref={ref}>{label}</div>;
});
