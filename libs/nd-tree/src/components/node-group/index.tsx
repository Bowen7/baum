import { useContext, useMemo, useState, useRef, useEffect } from 'react';
import { OptionsContext, LayoutContext } from '../../contexts';
import { Node } from '../node';
type NodeGroupProps = {
  path: string;
  node: any;
};
const MARGIN_HORIZONTAL = 80;
const MARGIN_VERTICAL = 40;
export const NodeGroup = (props: NodeGroupProps) => {
  const { path, node } = props;
  const { children: nodeChildren = [] } = node;

  const { nodeClassName, ContentComponent } = useContext(OptionsContext);
  const { positionMap, onNodeResize } = useContext(LayoutContext);

  const position = useMemo<Position>(
    () =>
      positionMap.has(path)
        ? (positionMap.get(path) as Position)
        : [-9999, -9999],
    [positionMap, path]
  );

  const onNodeLayout = (layout: [number, number]) => {
    onNodeResize(path, layout);
  };

  return (
    <>
      <Node
        x={position[0]}
        y={position[1]}
        className={nodeClassName}
        node={node}
        ContentComponent={ContentComponent}
        onNodeLayout={onNodeLayout}
      />
      {nodeChildren.map((child: any, index: number) => {
        const childPath = path + '-' + index;
        return <NodeGroup path={childPath} node={child} />;
      })}
      {/* {arrowStartBox && (
        <SVGPortal>
          <ArrowComponent startBox={arrowStartBox} endBox={arrowEndBox} />
        </SVGPortal>
      )} */}
    </>
  );
};
