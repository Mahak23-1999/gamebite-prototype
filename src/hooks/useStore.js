import { useState, useEffect } from 'react';
import { getState, subscribe } from '../data/store';

export function useStore() {
  const [state, setState] = useState(getState);
  useEffect(() => subscribe(setState), []);
  return state;
}
