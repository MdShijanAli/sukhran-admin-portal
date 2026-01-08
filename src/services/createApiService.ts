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
  statistics?: string;
  export?: string;
}

export interface ApiService<T = unknown> {
  fetchLists: (queryString?: string) => Promise<T>;
  fetchAll: (queryString?: string) => Promise<T>;
  fetchDetails: (id: number | string) => Promise<T>;
  storeItem: (data: unknown) => Promise<T>;
  updateItem: (id: number | string, data: unknown) => Promise<T>;
  deleteItem: (id: number | string) => Promise<T>;
  toggleStatus: (id: number | string) => Promise<T>;
  customFetchLists?: (queryString?: string) => Promise<T>;
  statistics?: (queryString?: string) => Promise<T>;
  exportData?: (queryString?: string) => Promise<T>;
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
        console.log("Fetch Lists response data:", response.data);
        if (store && store.setItems) {
          console.log(
            "Setting items in store with data:---->service",
            response.data
          );
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

      // Automatically detect if data is FormData and set appropriate headers
      const config =
        data instanceof FormData
          ? {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          : undefined;

      const response = await apiClient.post<T>(apiRoutes.create, data, config);

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

      // Automatically detect if data is FormData and use POST, otherwise PUT
      let response;
      if (data instanceof FormData) {
        response = await apiClient.post<T>(url, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await apiClient.put<T>(url, data);
      }

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

      console.log("Delete response:", response);

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

  const toggleStatus = async (id: number | string) => {
    try {
      const response = await apiClient.patch<T>(
        `${apiRoutes.getAll}/${id}/toggle-status`
      );

      if (response && response.status === 200) {
        if (store && store.updateItem) {
          store.updateItem(id, response.data);
        }
        return response.data;
      }
      throw new Error("Failed to toggle status");
    } catch (error) {
      console.error("Error toggling status:", error);
      throw error;
    }
  };

  const statistics = async (queryString?: string) => {
    try {
      if (!apiRoutes.statistics) {
        throw new Error("statistics route not configured");
      }
      const response = await apiClient.get<T>(
        apiRoutes.statistics + (queryString ? `?${queryString}` : "")
      );
      if (response && response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
      throw error;
    }
  };

  const exportData = async (queryString?: string) => {
    try {
      if (!apiRoutes.export) {
        throw new Error("export route not configured");
      }
      const response = await apiClient.get(
        apiRoutes.export + (queryString ? `?${queryString}` : ""),
        {
          responseType: "blob", // Important: tell axios to expect a blob
        }
      );

      if (response && response.status === 200) {
        // Create a download link and trigger it
        const blob = new Blob([response.data], {
          type:
            response.headers["content-type"] ||
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        // Get filename from content-disposition header or use default
        const contentDisposition = response.headers["content-disposition"];
        let filename = "export.xlsx";
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(
            /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
          );
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, "");
          }
        }

        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();

        // Cleanup
        link.remove();
        window.URL.revokeObjectURL(url);

        return { success: true, filename };
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      throw error;
    }
  };

  return {
    fetchLists,
    fetchAll: fetchLists, // Alias for fetchLists
    fetchDetails,
    storeItem,
    updateItem,
    statistics,
    exportData,
    deleteItem,
    toggleStatus,
  };
};
