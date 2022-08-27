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
  const { id, label, ...restProps } = props;
  return <DefaultNodeComponent id={id} label={label} {...restProps} />;
};
