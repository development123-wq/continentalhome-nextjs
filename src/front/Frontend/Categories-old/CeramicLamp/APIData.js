export const getPosts = async () => {
    const response = await fetch('https://187.124.157.146.nip.io/continental/api/products',{method: "GET"});
  
    return await response.json();
  };
  