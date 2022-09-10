import { Size } from '../../types';

type Props = {
  size: Size;
  children: React.ReactNode;
};

export const EdgesContainer = (props: Props) => {
  const { size, children } = props;
  return (
    <svg
      width={size[0]}
      height={size[1]}
      style={{ position: 'absolute' }}
      stroke="#000"
    >
      {children}
    </svg>
  );
};
