import { DefaultNodeComponent } from './node';
export type NodeContainerProps<T = {}> = T & {
  id: string;
  label?: string;
  x: number;
  y: number;
};

export const NodeContainer = (props: NodeContainerProps) => {
  const { id, label, ...restProps } = props;
  return <DefaultNodeComponent label={label} {...restProps} />;
};
