import { useState } from "react";
import Snackbar from "../utils/snackbar";
import axios from "axios";
import key from "../api/key";

const Reconfirm = () => {
  const [email, setEmail] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${key.API_URL}/reconfirm`, {
        email,
      });
      if (response.status === 200) {
        setSnackbarMessage(
          "Confirmation email resent. Please check your email."
        );
        setSnackbarOpen(true);
        console.log(response);
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
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
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: 'url("/background-image.webp")' }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-md w-full bg-white bg-opacity-90 rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Resend Email Confirmation
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-500 placeholder-gray-400"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#D8C1A9] hover:bg-[#E8D9C2] text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Resend Confirmation Email
            </button>
            <p className="text-center text-gray-500 text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-[#D8C1A9] hover:underline">
                Log in
              </a>
            </p>
          </form>
        </div>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </div>
  );
};

export default Reconfirm;
