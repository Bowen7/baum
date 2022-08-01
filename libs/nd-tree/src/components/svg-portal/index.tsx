import { useContext } from 'react';
import { createPortal } from 'react-dom';
import { SVGContainerContext } from '../../contexts';

type Props = {
  children: React.ReactNode;
};
export const SVGPortal = ({ children }: Props) => {
  const svgContainer = useContext(SVGContainerContext);
  if (!svgContainer) {
    return null;
  }
  return createPortal(children, svgContainer);
};
