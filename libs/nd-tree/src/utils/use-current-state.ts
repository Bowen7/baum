import {
  Dispatch,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';

export type CurrentStateType<S> = [S, Dispatch<S>, MutableRefObject<S>];

export const useCurrentState = <S>(initialState: S): CurrentStateType<S> => {
  const [state, setState] = useState<S>(initialState);
  const ref = useRef<S>(initialState);

  useEffect(() => {
    ref.current = state;
  }, [state]);

  const setValue = useCallback((val: S) => {
    const result = val;
    ref.current = result;
    setState(result);
  }, []);

  return [state, setValue, ref];
};
