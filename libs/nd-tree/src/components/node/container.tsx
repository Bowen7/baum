import { DefaultNodeComponent } from './node';
export type NodeContainerProps<T = {}> = T & {
  id: string;
  label?: string;
};
export const NodeContainer = (props: NodeContainerProps) => {
  const { id, label, ...restProps } = props;
  return <DefaultNodeComponent x={0} y={0} label={label} {...restProps} />;
};
