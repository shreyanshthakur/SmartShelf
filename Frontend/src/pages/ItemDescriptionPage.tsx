import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface Item {
  _id: string;
  itemName: string;
  itemPrice: number;
}

export const ItemDescriptionPage = () => {
  const [searchParams] = useSearchParams();
  console.log(searchParams);
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>("null");
  // const navigate = useNavigate();

  const itemId = searchParams.get("itemId");

  // call GET method which uses findOne on the collection "items"
  useEffect(() => {
    if (!itemId) {
      setError("Item ID is not provided");
      setLoading(false);
    }

    const fetchItem = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `http://localhost:5000/api/v1/itemList/${itemId}`
        );
        if (response.status !== 200) {
          throw new Error(`Http error: ${response.status}`);
        }
        const itemData = response.data;
        console.log(response.data);
        setItem(itemData);
      } catch (err) {
        console.log(`Error fetching item ${err}`);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [itemId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="min-h-screen min-w-screen bg-gray-100">
      {item ? <div>{item.itemName}</div> : <div>No item found.</div>}
    </div>
  );
};
