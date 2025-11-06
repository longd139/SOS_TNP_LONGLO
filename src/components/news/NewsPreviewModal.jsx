import React from 'react';
import { Calendar, FolderOpen, User } from 'lucide-react';
import BaseModal from '../base/BaseModal';
import { downloadUtils } from '../../utils/downLoadUtils';
import { STATUS_NEWS_LABELS } from '../../constants/status';
import { formatDate } from '../../utils/formatDate';

const NewsPreviewModal = ({ isOpen, onClose, newsData, isPreview = false }) => {
    if (!newsData) return null;

    const data = isPreview ? {
        tieu_de: newsData.tieuDe,
        noi_dung: newsData.noiDung,
        tac_gia: newsData.tacGia,
        url_anh_dai_dien: newsData.filePreview,
        danh_muc_tin_tuc: {
            ten_danh_muc: newsData.categoryName
        },
        thoi_gian_tao: new Date().toISOString()
    } : newsData;

    const imageUrl = isPreview 
        ? data.url_anh_dai_dien 
        : (data.url_anh_dai_dien ? downloadUtils.handleViewImage(data) : null);

    const statusLabel = STATUS_NEWS_LABELS[data.trang_thai] || data.trang_thai;
    const statusColor = data.trang_thai === 'NHAP' 
        ? 'text-yellow-800 bg-yellow-100' 
        : 'text-green-800 bg-green-100';

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Xem trước bài viết"
            size="lg"
        >
            <div className="space-y-4">
                {imageUrl && (
                    <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        <img
                            src={imageUrl}
                            alt={data.tieu_de}
                            className="w-full h-full object-contain"
                        />
                    </div>
                )}

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {data.tieu_de}
                    </h2>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm border-b border-gray-200 pb-4">
                    <span className={`inline-flex px-3 py-1 rounded-full font-medium ${statusColor}`}>
                        {statusLabel}
                    </span>

                    <span className="flex items-center gap-1.5 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {formatDate(data.thoi_gian_tao)}
                    </span>

                    {data.danh_muc_tin_tuc && (
                        <span className="flex items-center gap-1.5 text-gray-600">
                            <FolderOpen className="w-4 h-4" />
                            {data.danh_muc_tin_tuc.ten_danh_muc}
                        </span>
                    )}

                    {data.tac_gia && (
                        <span className="flex items-center gap-1.5 text-gray-600">
                            <User className="w-4 h-4" />
                            {data.tac_gia}
                        </span>
                    )}
                </div>

                <div className="prose max-w-none">
                    <div 
                        className="text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: data.noi_dung }}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default NewsPreviewModal;
