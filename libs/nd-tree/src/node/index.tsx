import { useContext, useMemo, useState, useRef, useEffect } from 'react';
import { NdTreeContext } from '../contexts';
import { useLayouts } from '../utils';
import { NdTreeBox } from '../arrow';
import { SVGPortal } from '../svg-portal';
type NodeProps = {
  index: number;
  x: number;
  y: number;
  node: any;
  arrowStartBox?: NdTreeBox;
  onNodeLayout: (index: number, layout: [number, number]) => void;
};
const MARGIN_HORIZONTAL = 80;
const MARGIN_VERTICAL = 40;
export const Node = (props: NodeProps) => {
  const { index, x, y, node, arrowStartBox, onNodeLayout } = props;
  const { name, children: nodeChildren = [] } = node;

  const nodeRef = useRef<HTMLDivElement>(null);
  const { nodeClassName, ArrowComponent } = useContext(NdTreeContext);
  const [layout, setLayout] = useState<[number, number]>([0, 0]);
  const [nodeLayout, setNodeLayout] = useState<[number, number]>([0, 0]);
  const [layouts, layoutsRef, setChildLayout] = useLayouts(nodeChildren.length);

  useEffect(() => {
    if (!nodeRef.current) {
      return;
    }
    const { width, height } = nodeRef.current.getBoundingClientRect();
    let [childrenWidth, childrenHeight] = layoutsRef.current
      .slice(0, nodeChildren.length)
      .reduce(
        (prev, item) => {
          return [Math.max(prev[0], item[0]), prev[1] + item[1]];
        },
        [0, 0]
      );
    if (nodeChildren.length) {
      childrenWidth += MARGIN_HORIZONTAL;
      childrenHeight += (nodeChildren.length - 1) * MARGIN_VERTICAL;
    }

    const layout: [number, number] = [
      width + childrenWidth,
      Math.max(height, childrenHeight),
    ];

    onNodeLayout(index, layout);
    setNodeLayout([width, height]);
    setLayout(layout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const childrenPositions = useMemo<[number, number][]>(() => {
    const [nodeWidth] = nodeLayout;
    const curX = x + nodeWidth + MARGIN_HORIZONTAL;
    let curY = y;
    return layouts.map(([, childHeight]) => {
      const position: [number, number] = [curX, curY];
      curY += childHeight + MARGIN_VERTICAL;
      return position;
    });
  }, [x, y, nodeLayout, layouts]);

  const nodeY = y + (layout[1] - nodeLayout[1]) / 2;

  const arrowEndBox = useMemo<NdTreeBox>(
    () => ({
      x: x,
      y: nodeY,
      width: nodeLayout[0],
      height: nodeLayout[1],
    }),
    [x, nodeY, nodeLayout]
  );

  return (
    <>
      <div
        ref={nodeRef}
        className={nodeClassName}
        style={{
          transform: `translate(${x}px, ${nodeY}px)`,
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {name}
      </div>
      {nodeChildren.map((child: any, index: number) => {
        const [childX = -9999, childY = -9999] = childrenPositions[index] || [];
        return (
          <Node
            index={index}
            x={childX}
            y={childY}
            node={child}
            arrowStartBox={arrowEndBox}
            onNodeLayout={setChildLayout}
          />
        );
      })}
      {arrowStartBox && (
        <SVGPortal>
          <ArrowComponent startBox={arrowStartBox} endBox={arrowEndBox} />
        </SVGPortal>
      )}
    </>
  );
};
