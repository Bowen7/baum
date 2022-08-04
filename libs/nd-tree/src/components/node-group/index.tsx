import { useContext, useMemo, useState, useRef, useEffect } from 'react';
import { OptionsContext } from '../../contexts';
import { useLayouts } from '../../utils';
import { NdTreeBox } from '../arrow';
import { SVGPortal } from '../svg-portal';
import { Node } from '../node';
type NodeGroupProps = {
  index: number;
  x: number;
  y: number;
  node: any;
  arrowStartBox?: NdTreeBox;
  onNodeGroupLayout: (index: number, layout: [number, number]) => void;
};
const MARGIN_HORIZONTAL = 80;
const MARGIN_VERTICAL = 40;
export const NodeGroup = (props: NodeGroupProps) => {
  const { index, x, y, node, arrowStartBox, onNodeGroupLayout } = props;
  const { children: nodeChildren = [] } = node;

  const { nodeClassName, ArrowComponent, ContentComponent } =
    useContext(OptionsContext);
  const [layout, setLayout] = useState<[number, number]>([0, 0]);
  const nodeLayoutRef = useRef<[number, number]>([0, 0]);
  const [nodeLayout, setNodeLayout] = useState<[number, number]>([0, 0]);
  const [layouts, layoutsRef, setChildLayout] = useLayouts(nodeChildren.length);

  useEffect(() => {
    const [nodeWidth, nodeHeight] = nodeLayoutRef.current;
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
      nodeWidth + childrenWidth,
      Math.max(nodeHeight, childrenHeight),
    ];

    onNodeGroupLayout(index, layout);
    setNodeLayout(nodeLayoutRef.current);
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

  const handleNodeLayout = (layout: [number, number]) => {
    nodeLayoutRef.current = layout;
  };

  return (
    <>
      <Node
        className={nodeClassName}
        x={x}
        y={nodeY}
        node={node}
        ContentComponent={ContentComponent}
        onNodeLayout={handleNodeLayout}
      />
      {nodeChildren.map((child: any, index: number) => {
        const [childX = -9999, childY = -9999] = childrenPositions[index] || [];
        return (
          <NodeGroup
            index={index}
            x={childX}
            y={childY}
            node={child}
            arrowStartBox={arrowEndBox}
            onNodeGroupLayout={setChildLayout}
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
