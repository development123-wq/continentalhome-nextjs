export const getPosts = async () => {
    const response = await fetch('http://187.124.157.146:5001/api/products',{method: "GET"});
  
    return await response.json();
  };
  