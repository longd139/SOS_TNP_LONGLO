import { Calendar, Eye, FolderOpen, User } from 'lucide-react';
import BaseModal from '../base/BaseModal';
import { downloadUtils } from '../../utils/downLoadUtils';
import { formatDate } from '../../utils/formatDate';
import DOMPurify from 'dompurify';

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
        luot_xem: newsData?._count?.tin_tuc_view || 0,
        thoi_gian_tao: new Date().toISOString(),
        dinh_kem_tin_tuc: []
    } : newsData;

    const imageUrl = isPreview 
        ? data.url_anh_dai_dien 
        : (data.url_anh_dai_dien ? downloadUtils.handleViewImage(data) : null);

    const processContentImages = (html, attachments) => {
        if (!html || !attachments || attachments.length === 0) return html;
        
        let processedHtml = html;
        const baseUrl = process.env.REACT_APP_API_URL;
        
        attachments.forEach((attachment, index) => {
            const placeholder = `<!--IMAGE_PLACEHOLDER_${index}-->`;
            if (processedHtml.includes(placeholder)) {
                // const alignmentMatch = html.match(new RegExp(`<[^>]*class="[^"]*ql-align-[^"]*"[^>]*>\\s*${placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
                let imgTag = `<img src="${baseUrl}${attachment.url_file}" alt="content-image" style="max-width: 100%; height: auto;" />`;
                processedHtml = processedHtml.replace(placeholder, imgTag);
            }
        });
        
        return processedHtml;
    };

    const sanitizeHtml = (rawHtml) => {
        if (!rawHtml) return '';
        return DOMPurify.sanitize(rawHtml, {
            ADD_ATTR: ['target', 'class', 'style', 'alt', 'width', 'height', 'rel'],
            ADD_TAGS: ['img', 'ol', 'ul', 'li'],
            ALLOW_DATA_ATTR: true,
            FORBID_TAGS: ['script'],
            transformTags: {
                'a': (tagName, attribs) => ({
                    tagName: 'a',
                    attribs: {
                        ...attribs,
                        target: '_blank',
                        rel: 'noopener noreferrer'
                    }
                })
            }
        });
    };

    let contentWithImages = data.noi_dung;
    
    if (!isPreview && data.dinh_kem_tin_tuc && data.dinh_kem_tin_tuc.length > 0) {
        contentWithImages = processContentImages(data.noi_dung, data.dinh_kem_tin_tuc);
    }
    
    const sanitizedContent = sanitizeHtml(contentWithImages);

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Xem trước bài viết"
            size="3xl"
            className="max-w-5xl"
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

                    {data._count?.tin_tuc_view !== undefined && (
                        <span className="flex items-center gap-1.5 text-gray-600">
                            <Eye className="w-4 h-4" />
                            {data._count?.tin_tuc_view || 0} 
                        </span>
                    )}

                </div>

                <div className="prose max-w-none news-content">
                    <style>{`
                        /* Quill text alignment classes */
                        .quill-content .ql-align-center {
                            text-align: center !important;
                        }
                        .quill-content .ql-align-right {
                            text-align: right !important;
                        }
                        .quill-content .ql-align-left {
                            text-align: left !important;
                        }
                        .quill-content .ql-align-justify {
                            text-align: justify !important;
                        }
                        
                        /* Ensure Quill alignment classes apply to images in preview */
                        .quill-content p.ql-align-center img,
                        .quill-content div.ql-align-center img {
                            display: block !important;
                            margin-left: auto !important;
                            margin-right: auto !important;
                        }
                        .quill-content p.ql-align-right img,
                        .quill-content div.ql-align-right img {
                            display: block !important;
                            margin-left: auto !important;
                            margin-right: 0 !important;
                        }
                        .quill-content p.ql-align-left img,
                        .quill-content div.ql-align-left img {
                            display: block !important;
                            margin-left: 0 !important;
                            margin-right: auto !important;
                        }
                        .quill-content img {
                            max-width: 100% !important;
                            height: auto !important;
                        }
                        
                        /* Ordered list styling */
                        .quill-content ol {
                            list-style-type: decimal !important;
                            padding-left: 1.5em !important;
                            margin: 0.5em 0 !important;
                        }
                        .quill-content ol li {
                            display: list-item !important;
                            list-style-type: decimal !important;
                        }
                        
                        /* Unordered list styling */
                        .quill-content ul {
                            list-style-type: disc !important;
                            padding-left: 1.5em !important;
                            margin: 0.5em 0 !important;
                        }
                        .quill-content ul li {
                            display: list-item !important;
                            list-style-type: disc !important;
                        }
                        
                        /* Nested list styling */
                        .quill-content ol ol,
                        .quill-content ul ol {
                            list-style-type: lower-alpha !important;
                        }
                        .quill-content ul ul,
                        .quill-content ol ul {
                            list-style-type: circle !important;
                        }
                    `}</style>
                    <div 
                        className="text-gray-700 leading-relaxed quill-content"
                        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
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
