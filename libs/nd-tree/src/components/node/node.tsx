import { useEffect, useRef, memo } from 'react';
import { Change } from '../../types';
type NodeComponentProps<T = {}> = T & {
  id: string;
  label?: string;
  onResize?: (change: Change) => void;
};

export const DefaultNodeComponent = memo((props: NodeComponentProps) => {
  const { id, label, onResize } = props;
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current && onResize) {
      const { width, height } = ref.current.getBoundingClientRect();
      onResize({ id, action: 'mount', size: [width, height] });
    }
  }, []);
  return (
    <div
      ref={ref}
      style={{
        border: '1px solid #1a192b',
        borderRadius: '3px',
        color: '#222',
        padding: '10px',
      }}
    >
      {label}
    </div>
  );
});
