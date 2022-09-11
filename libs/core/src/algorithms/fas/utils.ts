export const setGraphMap = (
  edgeMap: Map<string, Set<string>>,
  mapKeys: string | Set<string>,
  setKeys: string | Set<string>
) => {
  (typeof mapKeys === 'string' ? [mapKeys] : mapKeys).forEach((mapKey) => {
    if (!edgeMap.has(mapKey)) {
      edgeMap.set(mapKey, new Set());
    }
    (typeof setKeys === 'string' ? [setKeys] : setKeys).forEach((setKey) => {
      edgeMap.get(mapKey)!.add(setKey);
    });
  });
};

export const removeGraphMap = (
  edgeMap: Map<string, Set<string>>,
  mapKeys: string | Set<string>,
  setKeys: string | Set<string>
) => {
  (typeof mapKeys === 'string' ? [mapKeys] : mapKeys).forEach((mapKey) => {
    const set = edgeMap.get(mapKey);
    if (set) {
      (typeof setKeys === 'string' ? [setKeys] : setKeys).forEach((setKey) => {
        set.delete(setKey);
      });
      if (set.size === 0) {
        edgeMap.delete(mapKey);
      }
    }
  });
};
