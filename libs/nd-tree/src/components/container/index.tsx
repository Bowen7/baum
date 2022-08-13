import {
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { Node } from '../node';
import { Size, Position } from '../../types';
type Props = {
  transformedData: any;
};
export const Container = (props: Props) => {
  const { transformedData } = props;
  const [containerSize, setContainerSize] = useState<Size>([0, 0]);
  const nodeSizeMap = useRef<Map<string, Size>>(new Map());
  const nodeGroupSizeMap = useRef<Map<string, Size>>(new Map());
  const [containerWidth, containerHeight] = containerSize;
  const [positionMap, setPositionMap] = useState<Map<string, Position>>(
    () => new Map()
  );
  const resizing = useRef(false);
  const [layoutCount, setLayoutCount] = useState(0);

  const onNodeResize = useCallback((path: string, node: any, size: Size) => {
    if (!resizing.current) {
      setLayoutCount((count) => count + 1);
    }
    nodeSizeMap.current.set(path, size);
    const [nodeWidth, nodeHeight] = size;
    const { children = [] } = node;
    if (children.length > 0) {
      const [width, height] = children.reduce(
        ([prevWidth, prevHeight]: Size, _: any, index: number) => {
          const childPath = path + '-' + index;
          const [childWidth, childHeight] = nodeGroupSizeMap.current.get(
            childPath
          ) || [0, 0];
          return [Math.max(prevWidth, childWidth), prevHeight + childHeight];
        },
        [0, 0]
      );
      nodeGroupSizeMap.current.set(path, [
        width + nodeWidth,
        Math.max(height, nodeHeight),
      ]);
    } else {
      console.log(path, size);
      nodeGroupSizeMap.current.set(path, size);
    }
  }, []);

  useEffect(() => {
    if (layoutCount > 0) {
      const containerSize = nodeGroupSizeMap.current.get('') || [0, 0];
      setContainerSize(containerSize);

      const nextPositionMap = new Map<string, Size>();
      nextPositionMap.set('', [0, 0]);
      for (let i = transformedData.length - 1; i >= 0; i--) {
        const { path } = transformedData[i];
        const parentPath = path.slice(0, path.lastIndexOf('-'));
        const parentPosition = nextPositionMap.get(parentPath) || [0, 0];
        const [, nodeHeight] = nodeSizeMap.current.get(path) || [0, 0];
        const [, nodeGroupHeight] = nodeGroupSizeMap.current.get(path) || [
          0, 0,
        ];
        const position: Position = [
          parentPosition[0],
          parentPosition[1] + (nodeGroupHeight - nodeHeight) / 2,
        ];
        nextPositionMap.set(path, position);
      }
      setPositionMap(nextPositionMap);
    }
  }, [layoutCount]);

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        width: containerWidth + 'px',
        height: containerHeight + 'px',
        overflow: 'hidden',
      }}
    >
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width={containerWidth}
        height={containerHeight}
        stroke="#666"
        fill="#666"
        strokeWidth={2}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
        }}
      />
      {transformedData.map(({ path, node }: { path: string; node: any }) => (
        <Node
          className=""
          path={path}
          node={node}
          positionMap={positionMap}
          onResize={onNodeResize}
        />
      ))}
    </div>
  );
};
