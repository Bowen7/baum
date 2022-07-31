import { useContext, useRef, useState, useEffect } from 'react';
import { Node } from '../node';
import { NdTreeContext, SVGContainerContext } from '../contexts';

export const Container = () => {
  const { data } = useContext(NdTreeContext);

  const [laidout, setLaidout] = useState(false);
  const [layout, setLayout] = useState<[number, number]>([100, 100]);
  const [svgNode, setSVGNode] = useState<SVGSVGElement | null>(null);
  const layoutRef = useRef<[number, number]>([0, 0]);

  const handleNodeLayout = (layout: [number, number]) => {
    layoutRef.current = layout;
    setLaidout(false);
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
      }}
    >
      <svg
        ref={(ref: SVGSVGElement) => setSVGNode(ref)}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width={layout[0]}
        height={layout[1]}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
        }}
      />
      <SVGContainerContext.Provider value={svgNode}>
        <div
          style={{
            width: layout[0] + 'px',
            height: layout[1] + 'px',
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
