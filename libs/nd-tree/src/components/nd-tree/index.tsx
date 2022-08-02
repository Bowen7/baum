import { memo, useMemo, useState } from 'react';
import { NdTreeContext, NdTreeContextValue } from '../../contexts';
import { Container } from '../container';
import { Arrow, ArrowProps } from '../arrow';
import { NodeContent, NodeContentProps } from '../node';

type NdTreeElementTypesProps = {
  node?: React.ElementType;
  container?: React.ElementType;
};

type NdTreeComponentsProps = {
  node?: React.ComponentType;
  arrow?: React.ComponentType<ArrowProps>;
  content?: React.ComponentType<NodeContentProps>;
};

export type NdTreeProps = {
  data: any;
  direction?: 'vertical' | 'horizontal';
  childrenKey?: string;
  // virtualized?: boolean;
  // observeResize?: boolean;
  nodeClassName?: string;
  elementTypes?: NdTreeElementTypesProps;
  components?: NdTreeComponentsProps;
  onLayout?: () => void;
  onNodeLayout?: () => void;
};

export const NdTree = memo((props: NdTreeProps) => {
  const {
    data,
    direction = 'horizontal',
    childrenKey = 'children',
    nodeClassName = '',
    // virtualized = false,
    // observeResize = false,
    elementTypes = {},
    components = {},
    onLayout,
    onNodeLayout,
  } = props;

  const {
    node: nodeElementType = 'div',
    container: containerElementType = 'div',
  } = elementTypes;

  const {
    node: NodeComponent,
    arrow: ArrowComponent = Arrow,
    content: ContentComponent = NodeContent,
  } = components;

  const [layoutMap] = useState(() => new Map());

  const contextValue = useMemo<NdTreeContextValue>(
    () => ({
      data,
      ArrowComponent,
      nodeClassName,
      ContentComponent,
      layoutMap,
    }),
    [data, ArrowComponent, nodeClassName, ContentComponent, layoutMap]
  );

  return (
    <NdTreeContext.Provider value={contextValue}>
      <Container />
    </NdTreeContext.Provider>
  );
});
