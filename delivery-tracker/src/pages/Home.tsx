import { useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"

function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const axiosPrivate = useAxiosPrivate();

  const handleFetch = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axiosPrivate.get("/auth/me");
      setData(response.data);
      toast.success("Event has been created.")
    } catch (err: any) {
      toast.error("error occurred.")
      setError(err.response?.data?.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>admin</h1>
      
      <Button 
        onClick={handleFetch} 
        disabled={loading}
      >
        {loading ? "Loading..." : "Fetch /me"}
      </Button>

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
      )}

      {data && (
        <pre>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default Home;