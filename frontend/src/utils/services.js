export const baseUrl = "http://localhost:5000/api";

export const postrequest = async (url, data) => {
  const response = await fetch(`${baseUrl}/${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
};