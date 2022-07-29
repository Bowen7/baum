type Props = {
  children: () => React.ReactNode;
};

export const NodeItem = (props: Props) => {
  const { children } = props;
  return <>{children()}</>;
};
