import {
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { NodeGroup } from '../node-group';
import {
  OptionsContext,
  SVGContainerContext,
  LayoutContext,
  LayoutContextValue,
} from '../../contexts';

export const Container = () => {
  const { data } = useContext(OptionsContext);

  const [layout, setLayout] = useState<[number, number]>([0, 0]);
  const [svgNode, setSVGNode] = useState<SVGSVGElement | null>(null);

  const [layoutCount, setLayoutCount] = useState(0);
  const resizeRef = useRef(false);

  const sizeMap = useRef<Map<string, Size>>(new Map());
  const [positionMap, setPositionMap] = useState<Map<string, Position>>(
    () => new Map()
  );

  const onNodeResize = useCallback((path: string, size: [number, number]) => {
    sizeMap.current.set(path, size);
    if (!resizeRef.current) {
      resizeRef.current = true;
      setLayoutCount((count) => {
        resizeRef.current = false;
        return count + 1;
      });
    }
  }, []);

  const layoutContextValue = useMemo<LayoutContextValue>(
    () => ({
      sizeMap: sizeMap.current,
      positionMap,
      onNodeResize,
    }),
    [onNodeResize, positionMap]
  );

  useEffect(() => {
    if (layoutCount > 0) {
      // TODO: onLayout
    }
  }, [layoutCount]);

  return (
    <LayoutContext.Provider value={layoutContextValue}>
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          width: layout[0] + 'px',
          height: layout[1] + 'px',
          overflow: 'hidden',
        }}
      >
        <svg
          ref={(ref: SVGSVGElement) => setSVGNode(ref)}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width={layout[0]}
          height={layout[1]}
          stroke="#666"
          fill="#666"
          strokeWidth={2}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
          }}
        />
        <SVGContainerContext.Provider value={svgNode}>
          <div
            style={{
              position: 'absolute',
              width: '9999px',
              height: '9999px',
            }}
          >
            {svgNode && <NodeGroup path="0" node={data} />}
          </div>
        </SVGContainerContext.Provider>
      </div>
    </LayoutContext.Provider>
  );
};
