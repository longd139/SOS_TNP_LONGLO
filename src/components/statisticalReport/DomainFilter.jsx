import React, { useEffect, useState, useRef } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { REPORT_AREAS_API } from "../../apis/reportAreas";
import { showToast } from "../../utils/toastNotification";

export default function DomainFilter({ selectedDomain, onDomainChange }) {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchDomains = async () => {
      setLoading(true);
      try {
        const response = await REPORT_AREAS_API.getAllReportAreas(
          1,
          100,
          true,
          ""
        );
        if (response?.data) {
          const domainList = response.data.map((item) => ({
            value: item.id,
            label: item.ten || item.name,
          }));
          setDomains(domainList);
        }
      } catch (error) {
        showToast.error("Không thể tải danh sách lĩnh vực báo cáo.");
      } finally {
        setLoading(false);
      }
    };

    fetchDomains();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    onDomainChange(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex justify-between items-center">
        <div className="relative">
          <select
            value={selectedDomain}
            onChange={handleChange}
            disabled={loading}
            className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-base text-gray-700 appearance-none cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-w-48 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="all">Tất cả lĩnh vực</option>
            {domains.map((domain) => (
              <option key={domain.value} value={domain.value}>
                {domain.label}
              </option>
            ))}
          </select>
          {loading ? (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none animate-spin" />
          ) : (
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          )}
        </div>
      </div>
    </div>
  );
}