import { createContext, useContext } from 'react';

export const RefreshContext = createContext({ refreshKey: 0, refresh: () => {} });

export const useRefresh = () => useContext(RefreshContext);
