
const handleDownload = (template) => {
    const baseUrl = process.env.REACT_APP_API_URL;
    const fileUrl = `${baseUrl}${template.url_file_pdf}`;
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
};

const handleViewImage = (newsItem) => {
    const baseUrl = process.env.REACT_APP_API_URL;
    return `${baseUrl}${newsItem.url_anh_dai_dien}`;
}

export const downloadUtils = {
    handleDownload,
    handleViewImage
}