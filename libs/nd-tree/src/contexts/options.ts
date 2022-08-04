import React, { createContext } from 'react';
import { Arrow, ArrowProps } from '../components/arrow';
import { NodeContent, NodeContentProps } from '../components/node';

export type OptionsContextValue = {
  data: any;
  ArrowComponent: React.ComponentType<ArrowProps>;
  ContentComponent: React.ComponentType<NodeContentProps>;
  nodeClassName: string;
  onNodeLayout: (path: string, layout: [number, number]) => void;
};

export const OptionsContext = createContext<OptionsContextValue>({
  data: {},
  nodeClassName: '',
  ArrowComponent: Arrow,
  ContentComponent: NodeContent,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onNodeLayout: () => {},
});
