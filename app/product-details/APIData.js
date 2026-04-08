export const getProductById = async (pid) => {
  try {
    const response = await fetch(`http://187.124.157.146:5001/api/products/${pid}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return { success: false };
  }
};
