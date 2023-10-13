import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import key from "../api/key";

interface CommissionType {
  id: number;
  title: string;
  price: string;
  seller_id: number;
  created_at: string;
  updated_at: string;
}

const Commission = () => {
  const { username } = useParams<{ username: string }>();
  const [commissionTypes, setCommissionTypes] = useState<CommissionType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<CommissionType[]>(
          `${key.API_URL}/commission_types/${username}`
        );
        setCommissionTypes(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [username]);

  return (
    <div className="p-4 bg-gray-100 max-w-[90vw] h-[90vh] mx-auto mt-5 mb-5 flex justify-center items-center">
      {commissionTypes.length > 0 ? (
        <select className="border p-2 rounded w-2/3">
          {commissionTypes.map((commission) => (
            <option key={commission.id} value={commission.id}>
              {commission.title} - PHP{parseFloat(commission.price).toFixed(2)}
            </option>
          ))}
        </select>

      ) : (
        <p className="text-gray-600">No commission types available.</p>
      )}
    </div>
  );
};

export default Commission;
