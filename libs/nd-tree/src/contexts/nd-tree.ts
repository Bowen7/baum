import { createContext } from 'react';

export const NdTreeContext = createContext<{
  data: any;
  nodeClassName: string;
}>({
  data: {},
  nodeClassName: '',
});
