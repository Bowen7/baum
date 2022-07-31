import { useRef, useState, useCallback, MutableRefObject } from 'react';

type Layouts = [number, number][];
export const useLayouts = (
  layoutLength: number
): [
  Layouts,
  MutableRefObject<Layouts>,
  (index: number, layout: [number, number]) => void
] => {
  const [layouts, setLayouts] = useState<Layouts>([]);
  const layoutsRef = useRef<Layouts>([]);

  const setLayout = useCallback(
    (index: number, layout: [number, number]) => {
      layoutsRef.current[index] = layout;
      setLayouts(() => layoutsRef.current.slice(0, layoutLength));
    },
    [layoutLength]
  );

  return [layouts, layoutsRef, setLayout];
};
