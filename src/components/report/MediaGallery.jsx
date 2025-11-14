import React, { useState } from "react";
import { Image as ImageIcon, Video as VideoIcon, Play } from "lucide-react";
import MediaPreviewModal from "./MediaPreviewModal";

const MediaGallery = ({ images = [], videos = [], apiUrl }) => {
    const [previewModal, setPreviewModal] = useState({
        isOpen: false,
        mediaItems: [],
        initialIndex: 0,
    });

    const hasImages = images && images.length > 0;
    const hasVideos = videos && videos.length > 0;

    const openImagePreview = (index) => {
        const imageItems = images.map((img) => ({
            type: 'image',
            url: `${apiUrl}${img.url_file}`,
        }));
        setPreviewModal({
            isOpen: true,
            mediaItems: imageItems,
            initialIndex: index,
        });
    };

    const openVideoPreview = (index) => {
        const videoItems = videos.map((video) => ({
            type: 'video',
            url: `${apiUrl}${video.final_hls_url}`,
        }));
        setPreviewModal({
            isOpen: true,
            mediaItems: videoItems,
            initialIndex: index,
        });
    };

    const openAllMediaPreview = (startIndex, type) => {
        const imageItems = images.map((img) => ({
            type: 'image',
            url: `${apiUrl}${img.url_file}`,
        }));
        const videoItems = videos.map((video) => ({
            type: 'video',
            url: `${apiUrl}${video.final_hls_url}`,
        }));
        
        const allMedia = [...imageItems, ...videoItems];
        const adjustedIndex = type === 'image' ? startIndex : imageItems.length + startIndex;
        
        setPreviewModal({
            isOpen: true,
            mediaItems: allMedia,
            initialIndex: adjustedIndex,
        });
    };

    const closePreview = () => {
        setPreviewModal({
            isOpen: false,
            mediaItems: [],
            initialIndex: 0,
        });
    };

    const renderImageGrid = () => {
        if (!hasImages) return null;

        const displayImages = images.slice(0, 3);
        const remainingCount = images.length - 3;

        return (
            <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Hình ảnh ({images.length})
                </h4>
                <div className="grid grid-cols-3 gap-2">
                    {displayImages.map((file, index) => (
                        <div
                            key={index}
                            className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-100"
                            style={{ paddingBottom: '75%' }}
                            onClick={() => openImagePreview(index)}
                        >
                            {file.dinh_dang_file?.startsWith("image/") ? (
                                <>
                                    <img
                                        src={`${apiUrl}${file.url_file}`}
                                        alt={`Attachment ${index + 1}`}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                                    />
                                    {index === 2 && remainingCount > 0 && (
                                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                                            <span className="text-white text-2xl font-semibold">
                                                +{remainingCount}
                                            </span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <ImageIcon className="w-8 h-8 text-gray-400" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderVideoGrid = () => {
        if (!hasVideos) return null;

        const displayVideos = videos.slice(0, 3);
        const remainingCount = videos.length - 3;

        return (
            <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <VideoIcon className="w-4 h-4" />
                    Video ({videos.length})
                </h4>
                <div className="grid grid-cols-3 gap-2">
                    {displayVideos.map((video, index) => (
                        <div
                            key={index}
                            className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-900"
                            style={{ paddingBottom: '75%' }}
                            onClick={() => openVideoPreview(index)}
                        >
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent to-black">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-white bg-opacity-90 rounded-full p-3 group-hover:bg-opacity-100 transition-all">
                                        <Play className="w-6 h-6 text-gray-900" fill="currentColor" />
                                    </div>
                                </div>
                                {index === 2 && remainingCount > 0 && (
                                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                                        <span className="text-white text-2xl font-semibold">
                                            +{remainingCount}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-2 left-2 right-2">
                                <div className="flex items-center gap-1 text-white text-xs">
                                    <VideoIcon className="w-3 h-3" />
                                    <span>Video {index + 1}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (!hasImages && !hasVideos) return null;

    return (
        <>
            <div className="space-y-3">
                {renderImageGrid()}
                {renderVideoGrid()}
            </div>

            <MediaPreviewModal
                isOpen={previewModal.isOpen}
                onClose={closePreview}
                mediaItems={previewModal.mediaItems}
                initialIndex={previewModal.initialIndex}
            />
        </>
    );
};

export default MediaGallery;
