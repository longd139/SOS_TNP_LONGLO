import { showToast } from "./toastNotification";

const handleDownload = (template) => {
    const baseUrl = process.env.REACT_APP_API_URL;
    const fileUrl = `${baseUrl}${template.urlFilePdf}`;
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
};

const handleViewImage = (newsItem) => {
    const baseUrl = process.env.REACT_APP_API_URL;
    return `${baseUrl}${newsItem.url_anh_dai_dien}`;
}

const handleDownloadExcel = (data) => {
    if (!data?.relative_url) {
      showToast.error('File không tồn tại hoặc đã bị xóa');
        return;
    }

    const baseUrl = process.env.REACT_APP_API_URL;
    const fileUrl = `${baseUrl}${data.relative_url}`;

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const handleDownloadPdf = async (data) => {
    if (!data?.url_file_pdf && !data?.urlFilePdf) {
        showToast.error('File không tồn tại hoặc đã bị xóa');
        return;
    }
    
    try {
        const baseUrl = process.env.REACT_APP_API_URL;
        const fileUrl = `${baseUrl}${data.url_file_pdf || data.urlFilePdf}`;
        
        const urlParts = (data.url_file_pdf || data.urlFilePdf).split('/');
        const fileName = urlParts[urlParts.length - 1] || `${data.ten_mau_don || data.tenMauDon || 'template'}.pdf`;
        
        const response = await fetch(fileUrl);
        
        if (!response.ok) {
            throw new Error('Không thể tải file');
        }
        
        const blob = await response.blob();
        
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => {
            window.URL.revokeObjectURL(blobUrl);
        }, 100);
        
        showToast.success('Tải file thành công!');
    } catch (error) {
        showToast.error('Không thể tải file. Vui lòng thử lại!');
    }
};

export const downloadUtils = {
    handleDownload,
    handleViewImage,
    handleDownloadExcel,
    handleDownloadPdf
}