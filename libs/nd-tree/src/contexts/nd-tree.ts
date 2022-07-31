import { createContext } from 'react';
import { Arrow, ArrowProps } from '../arrow';

export type NdTreeContextValue = {
  data: any;
  ArrowComponent: React.ComponentType<ArrowProps>;
  nodeClassName: string;
};

export const NdTreeContext = createContext<NdTreeContextValue>({
  data: {},
  nodeClassName: '',
  ArrowComponent: Arrow,
});
