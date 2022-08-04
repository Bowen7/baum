import { createContext } from 'react';

type LayoutContextValue = {
  sizeMap: Map<string, Size>;
  positionMap: Map<string, Position>;
  onNodeResize: (path: string, size: Size) => void;
};
export const LayoutContext = createContext<LayoutContextValue>({
  sizeMap: new Map(),
  positionMap: new Map(),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onNodeResize: () => {},
});
