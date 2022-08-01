import { useContext, useRef, useState, useEffect } from 'react';
import { Node } from '../node';
import { NdTreeContext, SVGContainerContext } from '../contexts';

export const Container = () => {
  const { data } = useContext(NdTreeContext);

  const [laidout, setLaidout] = useState(false);
  const [layout, setLayout] = useState<[number, number]>([0, 0]);
  const [svgNode, setSVGNode] = useState<SVGSVGElement | null>(null);
  const layoutRef = useRef<[number, number]>([0, 0]);

  const handleNodeLayout = (layout: [number, number]) => {
    layoutRef.current = layout;
    setLaidout(true);
  };

  useEffect(() => {
    if (laidout) {
      setLayout(layoutRef.current);
    }
  }, [laidout]);

  return (
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
          {svgNode && (
            <Node
              index={0}
              x={0}
              y={0}
              node={data}
              onNodeLayout={(_, layout) => handleNodeLayout(layout)}
            />
          )}
        </div>
      </SVGContainerContext.Provider>
    </div>
  );
};
