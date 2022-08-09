import { memo, useMemo, useRef, useState } from 'react';
import {
  OptionsContext,
  OptionsContextValue,
  LayoutContext,
  LayoutContextValue,
} from '../../contexts';
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

  const sizeMap = useRef<Map<string, Size>>(new Map());
  const [positionMap, setPositionMap] = useState<Map<string, Position>>(
    () => new Map()
  );

  const onNodeResize = useCallback(
    (path: string, size: [number, number]) => {
      sizeMap.current.set(path, size);
    },
    []
  );

  const optionsContextValue = useMemo<OptionsContextValue>(
    () => ({
      data,
      ArrowComponent,
      nodeClassName,
      ContentComponent,
    }),
    [data, ArrowComponent, nodeClassName, ContentComponent]
  );

  const layoutContextValue = useMemo<LayoutContextValue>(
    () => ({
      sizeMap: sizeMap.current,
      positionMap,
      onNodeResize,
    }),
    []
  );

  return (
    <OptionsContext.Provider value={optionsContextValue}>
      <LayoutContext.Provider value={layoutContextValue}>
        <Container />
      </LayoutContext.Provider>
    </OptionsContext.Provider>
  );
});
