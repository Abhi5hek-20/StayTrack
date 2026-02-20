import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRecentLogbookEntriesThunk } from "../../store/admin/logbook/logbookThunk";

const FullLogBook = ({ onBack }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { allEntries, loading, error } = useSelector(
    (state) => state.adminLogbook
  );

  const logbookData = allEntries || [];
  // ✅ SAME behavior as React Query
  useEffect(() => {
    dispatch(getRecentLogbookEntriesThunk(100));

    const interval = setInterval(() => {
      dispatch(getRecentLogbookEntriesThunk(100));
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const filteredEntries = logbookData.filter((entry) => {
    const matchesSearch =
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.destination.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "checkedOut" && entry.action === "Check Out") ||
      (filterStatus === "checkedIn" && entry.action === "Check In");

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading logbook data</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-600 hover:text-black">
            ← Back
          </button>
          <h1 className="text-xl font-bold">Full LogBook</h1>
        </div>
        <span className="text-sm text-gray-600">
          Total Entries: {filteredEntries.length}
        </span>
      </div>

      {/* FILTERS */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="border px-4 py-2 rounded-lg"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border px-4 py-2 rounded-lg"
          >
            <option value="all">All Entries</option>
            <option value="checkedOut">Currently Out</option>
            <option value="checkedIn">Checked In</option>
          </select>
        </div>

        {/* TABLE */}
        {filteredEntries.length > 0 ? (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y">
              <thead className="bg-gray-100">
                <tr>
                  {["Student", "Room", "Action", "Out", "In", "Destination", "Reason"].map(
                    (h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium">
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{entry.name}</td>
                    <td className="px-6 py-4">{entry.room}</td>
                    <td className="px-6 py-4">{entry.action}</td>
                    <td className="px-6 py-4">{entry.outTime || "-"}</td>
                    <td className="px-6 py-4">{entry.inTime || "-"}</td>
                    <td className="px-6 py-4">{entry.destination}</td>
                    <td className="px-6 py-4">{entry.reason || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">No entries found</p>
        )}
      </div>
    </div>
  );
};

export default FullLogBook;
