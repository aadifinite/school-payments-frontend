import { useState } from "react";
import api from "../api/axios.js";
import Modal from "./Modal.jsx";

export default function StatusCheck() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const check = async () => {
    setError("");
    if (!orderId) {
      setError("Enter a custom_order_id");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get(
        `/transaction-status/${encodeURIComponent(orderId)}`
      );
      setResult(data);
      setOpen(true);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to fetch status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Check Transaction Status</h2>

      <input
        type="text"
        placeholder="Enter custom_order_id"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={check}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Checking..." : "Check Status"}
      </button>

      {/* Modal for showing result */}
      {open && (
        <Modal open={open} onClose={() => setOpen(false)}>
          <h3 className="text-lg font-semibold mb-2">Transaction Result</h3>
          <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </Modal>
      )}
    </div>
  );
}
