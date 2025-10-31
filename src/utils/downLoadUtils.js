const handleDownload = (template) => {
    const baseUrl = process.env.REACT_APP_API_URL;
    const fileUrl = `${baseUrl}${template.url_file_pdf}`;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = template.ten_mau_don;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const downloadUtils = {
    handleDownload,
}