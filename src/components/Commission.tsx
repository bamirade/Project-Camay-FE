import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import key from "../api/key";
import Snackbar from "../utils/snackbar";

interface CommissionType {
  id: number;
  title: string;
  price: string;
  seller_id: number;
  created_at: string;
  updated_at: string;
}

const Commission = () => {
  const [description, setDescription] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [commissionTypes, setCommissionTypes] = useState<CommissionType[]>([]);
  const [selectedCommission, setSelectedCommission] =
    useState<CommissionType>();

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

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(event.target.value);
    const commission = commissionTypes.find(
      (commission) => commission.id === selectedId
    );
    setSelectedCommission(commission);
  };

  const sendCommission = async () => {
    const authToken = localStorage.getItem("token");
    try {
      await axios.post(
        `${key.API_URL}/commission/create`,
        {
          commission_type_id: selectedCommission?.id,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setSnackbarOpen(true);
      setSnackbarMessage("Commission Sent and Artist Notified");
      navigate("/commissions")
    } catch (error) {
      setSnackbarOpen(true);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data || error.message;
        console.log(errorMessage);
        setSnackbarMessage(errorMessage.error.toString());
      } else {
        console.error(`Unexpected Error:`, error);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="p-4 bg-gray-100 max-w-[90vw] h-[90vh] mx-auto mt-5 mb-5 flex justify-center items-center">
      {commissionTypes.length > 0 ? (
        <div className="w-2/3">
          <h1>Select Commission:</h1>
          <select
            className="border p-2 rounded w-full"
            value={selectedCommission?.id || ""}
            onChange={handleSelectChange}
          >
            <option value="" disabled>
              Select Commission Type
            </option>
            {commissionTypes.map((commission) => (
              <option key={commission.id} value={commission.id}>
                {commission.title} - PHP
                {parseFloat(commission.price).toFixed(2)}
              </option>
            ))}
          </select>

          <h1>Additional Information (optional):</h1>
          <div className="w-full">
            <textarea
              className="w-full min-h-[40vh]"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button
            className={`px-4 py-2 text-white ${
              selectedCommission
                ? "bg-[#D8C1A9] hover:bg-[#E8D9C2]"
                : "bg-gray-400"
            } rounded-md focus:outline-none`}
            onClick={sendCommission}
            disabled={!selectedCommission}
          >
            Send
          </button>
        </div>
      ) : (
        <p className="text-gray-600">No commission types available.</p>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </div>
  );
};

export default Commission;
