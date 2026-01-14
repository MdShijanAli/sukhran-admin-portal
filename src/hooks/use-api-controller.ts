import { useState, useEffect, useCallback, useRef } from "react";

interface UseApiControllerOptions<T, StoreType> {
  serviceFn: () => Promise<T>;
  store: StoreType;
  dataKey: keyof StoreType;
  storeSetterKey?: keyof StoreType;
  autoFetch?: boolean;
  cacheEnabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseApiControllerReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  fetch: () => Promise<void>;
  clear: () => void;
}

/**
 * Generic API controller hook with smart caching
 *
 * @example
 * const { data, isLoading, error, refresh } = useApiController({
 *   serviceFn: () => referralService.getStatistics(),
 *   store: useReferralStore.getState(),
 *   dataKey: 'statistics',
 *   autoFetch: true,
 *   cacheEnabled: true
 * });
 */
export function useApiController<T, StoreType extends Record<string, any>>({
  serviceFn,
  store,
  dataKey,
  storeSetterKey,
  autoFetch = true,
  cacheEnabled = true,
  onSuccess,
  onError,
}: UseApiControllerOptions<T, StoreType>): UseApiControllerReturn<T> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isFetching = useRef(false);
  const hasInitialFetch = useRef(false);

  // Get data from store
  const data = store[dataKey] as T | null;

  // Check if we should fetch based on cache
  const shouldFetch = useCallback(() => {
    if (!cacheEnabled) return true;
    if (!data) return true;

    // If data is an array, check if it's empty
    if (Array.isArray(data) && data.length === 0) return true;

    // If data is an object, check if it's empty
    if (
      typeof data === "object" &&
      data !== null &&
      Object.keys(data).length === 0
    )
      return true;

    return false;
  }, [data, cacheEnabled]);

  // Fetch function
  const fetch = useCallback(async () => {
    // Prevent duplicate requests
    if (isFetching.current) return;

    isFetching.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const result = await serviceFn();

      // If store has a setter method, use it
      if (storeSetterKey && typeof store[storeSetterKey] === "function") {
        (store[storeSetterKey] as Function)(result);
      }

      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  }, [serviceFn, store, storeSetterKey, onSuccess, onError]);

  // Refresh function (bypasses cache)
  const refresh = useCallback(async () => {
    await fetch();
  }, [fetch]);

  // Clear function
  const clear = useCallback(() => {
    setError(null);
    if (storeSetterKey && typeof store[storeSetterKey] === "function") {
      (store[storeSetterKey] as Function)(null);
    }
  }, [store, storeSetterKey]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch && !hasInitialFetch.current) {
      hasInitialFetch.current = true;
      if (shouldFetch()) {
        fetch();
      }
    }
  }, [autoFetch]);

  return {
    data,
    isLoading,
    error,
    refresh,
    fetch,
    clear,
  };
}

/**
 * Hook specifically for list/table data with pagination
 */
export function useListController<T, StoreType extends Record<string, any>>({
  serviceFn,
  store,
  dataKey = "items" as keyof StoreType,
  autoFetch = true,
  cacheEnabled = true,
  onSuccess,
  onError,
}: Omit<UseApiControllerOptions<T, StoreType>, "dataKey"> & {
  dataKey?: keyof StoreType;
}) {
  return useApiController({
    serviceFn,
    store,
    dataKey,
    storeSetterKey: "setItems" as keyof StoreType,
    autoFetch,
    cacheEnabled,
    onSuccess,
    onError,
  });
}

/**
 * Hook for statistics/single object data
 */
export function useStatsController<T, StoreType extends Record<string, any>>({
  serviceFn,
  store,
  dataKey,
  setterKey,
  autoFetch = true,
  cacheEnabled = true,
  onSuccess,
  onError,
}: Omit<UseApiControllerOptions<T, StoreType>, "storeSetterKey"> & {
  setterKey?: keyof StoreType;
}) {
  return useApiController({
    serviceFn,
    store,
    dataKey,
    storeSetterKey: setterKey,
    autoFetch,
    cacheEnabled,
    onSuccess,
    onError,
  });
}

export default useApiController;
