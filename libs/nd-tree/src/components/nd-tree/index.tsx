import { memo, useMemo, useState } from 'react';
import { NdTreeContext, NdTreeContextValue } from '../../contexts';
import { Container } from '../container';
import { Arrow, ArrowProps } from '../arrow';
import { NodeContent, NodeContentProps } from '../node';
import { useCallback } from 'react';

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

  const [layoutMap] = useState<Map<string, [number, number]>>(() => new Map());

  const onNodeLayout = useCallback(
    (path: string, layout: [number, number]) => {
      layoutMap.set(path, layout);
    },
    [layoutMap]
  );

  const contextValue = useMemo<NdTreeContextValue>(
    () => ({
      data,
      ArrowComponent,
      nodeClassName,
      ContentComponent,
      onNodeLayout,
    }),
    [data, ArrowComponent, nodeClassName, ContentComponent, onNodeLayout]
  );

  return (
    <NdTreeContext.Provider value={contextValue}>
      <Container />
    </NdTreeContext.Provider>
  );
});
