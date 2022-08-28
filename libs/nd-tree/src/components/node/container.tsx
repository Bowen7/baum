import { DefaultNodeComponent } from './node';
import { Change } from '../../types';
export type NodeContainerProps<T = {}> = T & {
  id: string;
  label?: string;
  x: number;
  y: number;
  onResize?: (change: Change) => void;
};

export const NodeContainer = (props: NodeContainerProps) => {
  const { id, label, x, y, ...restProps } = props;
  return (
    <div
      style={{ position: 'absolute', transform: `translate(${x}px, ${y}px)` }}
    >
      <DefaultNodeComponent id={id} label={label} {...restProps} />
    </div>
  );
};
