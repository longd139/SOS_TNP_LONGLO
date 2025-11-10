import { showToast } from "./toastNotification";

const handleDownload = (template) => {
    const baseUrl = process.env.REACT_APP_API_URL;
    const fileUrl = `${baseUrl}${template.url_file_pdf}`;
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

export const downloadUtils = {
    handleDownload,
    handleViewImage,
    handleDownloadExcel
}