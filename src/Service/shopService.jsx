import shopApiClient, { handleApiResponse } from "./apiClient";

/**
 * @param {Object} shopData - Shop data (name, category, location, description, email, phone)
 * @returns {Promise<{data, success, error, statusCode}>}
 */
export const createShop = async (shopData) => {
  return handleApiResponse(shopApiClient.post("/shops", shopData));
};

/**
 * @param {number} page - Page number (default: 0)
 * @param {number} size - Items per page (default: 10)
 * @returns {Promise<{data, success, error, statusCode}>}
 */

export const getAllShops = async (page = 0, size = 10) => {
  return handleApiResponse(
    shopApiClient.get(`/shops?page=${page}&size=${size}`)
  );
};

/**
 * @param {number} shopId - ID of the shop
 * @returns {Promise<{data, success, error, statusCode}>}
 */
export const getShopDetails = async (shopId) => {
  return handleApiResponse(shopApiClient.get(`/shops/${shopId}`));
};

/**
 * @param {number} shopId - ID of the shop
 * @returns {Promise<{data, success, error, statusCode}>}
 */
export const getShopAssets = async (shopId) => {
  return handleApiResponse(shopApiClient.get(`/shops/${shopId}/assets`));
};

/**
 * @param {number} shopId - ID of the shop
 * @param {Object} shopData - Updated shop data
 * @returns {Promise<{data, success, error, statusCode}>}
 */
export const updateShopDetails = async (shopId, shopData) => {
  try {
    const formData = new FormData();

    if (shopData.name) formData.append("name", shopData.name);
    if (shopData.category) formData.append("category", shopData.category);
    if (shopData.location) formData.append("location", shopData.location);
    if (shopData.description)
      formData.append("description", shopData.description);
    if (shopData.email) formData.append("email", shopData.email);
    if (shopData.phone) formData.append("phone", shopData.phone);

    if (shopData.logo instanceof File) formData.append("logo", shopData.logo);

    if (Array.isArray(shopData.images)) {
      shopData.images.forEach((images) => {
        if (images instanceof File) {
          formData.append("images", images);
        }
      });
    }

    const response = await shopApiClient.patch(`/shops/${shopId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return handleApiResponse(response);
  } catch (error) {
    return handleApiResponse(error.response);
  }
};

/**
 * @param {number} shopId - ID of the shop
 * @param {Object} coordinates - 3D positioning data
 * @returns {Promise<{data, success, error, statusCode}>}
 */
export const updateShopCoordinates = async (shopId, coordinates) => {
  return handleApiResponse(
    shopApiClient.put(`/shops/${shopId}/coordinates`, coordinates)
  );
};

/**
 * @param {number} shopId - ID of the shop
 * @param {Object} socialData - Social media platform and link
 * @returns {Promise<{data, success, error, statusCode}>}
 */
export const updateShopSocials = async (shopId, socialData) => {
  return handleApiResponse(
    shopApiClient.put(`/shops/${shopId}/socials`, socialData)
  );
};

/**
 * @param {number} shopId - ID of the shop
 * @param {Object} assetData - Asset data (glb)
 * @returns {Promise<{data, success, error, statusCode}>}
 */
export const uploadShopAssets = async (shopId, assetData) => {
  const formData = new FormData();
  formData.append("glb", assetData);
  return handleApiResponse(
    shopApiClient.post(`/shops/${shopId}/model`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  );
};

/**
 * @param {number} shopId - ID of the shop
 * @returns {Promise<{data, success, error, statusCode}>}
 */
export const deleteShop = async (shopId) => {
  return handleApiResponse(shopApiClient.delete(`/shops/${shopId}`));
};
