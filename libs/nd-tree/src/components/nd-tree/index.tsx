import { memo, useMemo, useRef, useState, useCallback } from 'react';
import { OptionsContext, OptionsContextValue } from '../../contexts';
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
  dataTransform?: () => any;
  onLayout?: () => void;
};

const defaultDataTransform = <T extends { children: T[] }>(data: T): T[] => {
  const stack: T[] = [data];
  const nodes: T[] = [];
  while (stack.length > 0) {
    const node = stack.pop()!;
    nodes.push(node);
    const { children = [] } = node;
    for (let i = children.length - 1; i >= 0; i--) {
      stack.push(children[i]);
    }
  }
  return nodes;
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
    dataTransform = defaultDataTransform,
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

  const optionsContextValue = useMemo<OptionsContextValue>(
    () => ({
      data,
      ArrowComponent,
      nodeClassName,
      ContentComponent,
    }),
    [data, ArrowComponent, nodeClassName, ContentComponent]
  );

  const nodes = useMemo(() => dataTransform(data), [data, dataTransform]);

  return (
    <OptionsContext.Provider value={optionsContextValue}>
      <Container />
    </OptionsContext.Provider>
  );
});
