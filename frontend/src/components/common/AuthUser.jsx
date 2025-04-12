import URL from "../url/BackendUrl";

const authUserQuery = {
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const response = await fetch(`${URL}/api/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        const data = await response.json();
  
  
        if (data.error) {
          return null;
        }
        if (!response.ok) {
          throw new Error(data.error || "Something Went Wrong");
        }
  
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    retry: false,
  };
export default authUserQuery  