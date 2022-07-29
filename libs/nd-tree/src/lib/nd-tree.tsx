import styles from './nd-tree.module.css';

/* eslint-disable-next-line */
export interface NdTreeProps {}

export function NdTree(props: NdTreeProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to NdTree!</h1>
    </div>
  );
}

export default NdTree;
