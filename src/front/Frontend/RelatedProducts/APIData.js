export const getPosts = async (page = 1, limit = 12) => {
  const response = await fetch(`http://187.124.157.146:5001/api/products?page=${page}&limit=4`, {
    method: "GET"
  });

  return await response.json();
};
