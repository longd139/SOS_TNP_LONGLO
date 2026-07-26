import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Construction, ArrowLeft } from 'lucide-react';

const PlaceholderPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <Construction size={72} className="text-gray-400 mb-6" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Đang phát triển
      </h1>
      <p className="text-gray-600 mt-1 mb-8 max-w-md">
        Chức năng này sẽ được bổ sung trong giai đoạn tiếp theo.
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <ArrowLeft size={18} />
        Quay lại Dashboard
      </button>
    </div>
  );
};

export default PlaceholderPage;
