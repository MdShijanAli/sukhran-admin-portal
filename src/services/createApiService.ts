import apiClient from "@/api/apiClient";

interface StoreActions {
  setItems?: (data: unknown) => void;
  addItem?: (data: unknown) => void;
  updateItem?: (id: number | string, data: unknown) => void;
  removeItem?: (id: number | string) => void;
}

interface ApiRoutes {
  getAll: string;
  getById?: (id: number | string) => string;
  create?: string;
  update?: (id: number | string) => string;
  delete?: (id: number | string) => string;
}

interface ApiService<T = unknown> {
  fetchLists: (queryString?: string) => Promise<T>;
  fetchDetails: (id: number | string) => Promise<T>;
  storeItem: (data: unknown) => Promise<T>;
  updateItem: (id: number | string, data: unknown) => Promise<T>;
  deleteItem: (id: number | string) => Promise<T>;
}

export const createApiService = <T = unknown>(
  apiRoutes: ApiRoutes,
  store?: StoreActions
): ApiService<T> => {
  const fetchLists = async (queryString?: string) => {
    try {
      const url = `${apiRoutes.getAll}${queryString ? `?${queryString}` : ""}`;
      const response = await apiClient.get<T>(url);

      if (response && response.status === 200) {
        // Update store if provided
        if (store && store.setItems) {
          store.setItems(response.data);
        }
        return response.data;
      }
      throw new Error("Failed to fetch list");
    } catch (error) {
      console.error("Error fetching list:", error);
      throw error;
    }
  };

  const fetchDetails = async (id: number | string) => {
    try {
      if (!apiRoutes.getById) {
        throw new Error("getById route not configured");
      }
      const url = apiRoutes.getById(id);
      const response = await apiClient.get<T>(url);

      if (response && response.status === 200) {
        return response.data;
      }
      throw new Error("Failed to fetch details");
    } catch (error) {
      console.error("Error fetching details:", error);
      throw error;
    }
  };

  const storeItem = async (data: unknown) => {
    try {
      if (!apiRoutes.create) {
        throw new Error("create route not configured");
      }
      const response = await apiClient.post<T>(apiRoutes.create, data);

      if (response && (response.status === 200 || response.status === 201)) {
        // Update store if provided
        if (store && store.addItem) {
          store.addItem(response.data);
        }
        return response.data;
      }
      throw new Error("Failed to create item");
    } catch (error) {
      console.error("Error creating item:", error);
      throw error;
    }
  };

  const updateItem = async (id: number | string, data: unknown) => {
    try {
      if (!apiRoutes.update) {
        throw new Error("update route not configured");
      }
      const url = apiRoutes.update(id);
      const response = await apiClient.put<T>(url, data);

      if (response && response.status === 200) {
        // Update store if provided
        if (store && store.updateItem) {
          store.updateItem(id, response.data);
        }
        return response.data;
      }
      throw new Error("Failed to update item");
    } catch (error) {
      console.error("Error updating item:", error);
      throw error;
    }
  };

  const deleteItem = async (id: number | string) => {
    try {
      if (!apiRoutes.delete) {
        throw new Error("delete route not configured");
      }
      const url = apiRoutes.delete(id);
      const response = await apiClient.delete<T>(url);

      if (response && response.status === 200) {
        // Update store if provided
        if (store && store.removeItem) {
          store.removeItem(id);
        }
        return response.data;
      }
      throw new Error("Failed to delete item");
    } catch (error) {
      console.error("Error deleting item:", error);
      throw error;
    }
  };

  return {
    fetchLists,
    fetchDetails,
    storeItem,
    updateItem,
    deleteItem,
  };
};
