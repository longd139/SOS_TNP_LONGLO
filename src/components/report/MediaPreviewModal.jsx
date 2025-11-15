import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Hls from "hls.js";

const MediaPreviewModal = ({ isOpen, onClose, mediaItems = [], initialIndex = 0 }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const videoRef = useRef(null);
    const hlsRef = useRef(null);

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);

    useEffect(() => {
        if (!isOpen) return;

        const currentMedia = mediaItems[currentIndex];
        if (currentMedia?.type === 'video' && videoRef.current) {
            const videoUrl = currentMedia.url;

            if (Hls.isSupported()) {
                if (hlsRef.current) {
                    hlsRef.current.destroy();
                }

                const hls = new Hls({
                    debug: false,
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });

                hls.loadSource(videoUrl);
                hls.attachMedia(videoRef.current);

                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    videoRef.current.play().catch(err => {
                    });
                });

                hls.on(Hls.Events.ERROR, (event, data) => {
                    if (data.fatal) {
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                hls.startLoad();
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                hls.recoverMediaError();
                                break;
                            default:
                                hls.destroy();
                                break;
                        }
                    }
                });

                hlsRef.current = hls;
            } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                videoRef.current.src = videoUrl;
                videoRef.current.addEventListener('loadedmetadata', () => {
                    videoRef.current.play().catch(err => {
                    });
                });
            }
        }

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [currentIndex, isOpen, mediaItems]);

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : mediaItems.length - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev < mediaItems.length - 1 ? prev + 1 : 0));
    };

    const handleKeyDown = (e) => {
        if (e.key === "ArrowLeft") handlePrevious();
        if (e.key === "ArrowRight") handleNext();
        if (e.key === "Escape") onClose();
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, currentIndex]);

    if (!isOpen || mediaItems.length === 0) return null;

    const currentMedia = mediaItems[currentIndex];

    const modalContent = (
        <div 
            className="fixed inset-0 z-[9999] overflow-hidden"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            aria-labelledby="modal-title" 
            role="dialog" 
            aria-modal="true"
        >
            <div 
                className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" 
                onClick={onClose}
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            ></div>

            <div 
                className="fixed inset-0 flex justify-center p-4"
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}
            >
                <div 
                    className="relative bg-white rounded-lg shadow-xl w-full max-w-5xl"
                    style={{ 
                        height: '70vh', 
                        maxHeight: '70vh',
                        minHeight: '530px',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    <div 
                        className="flex items-center justify-between px-4 bg-white border-b border-gray-200"
                        style={{ flexShrink: 0}}
                    >
                        <h3 className="text-lg font-semibold text-gray-900 pr-8">
                            Xem phương tiện ({currentIndex + 1}/{mediaItems.length})
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div 
                        className="relative bg-black flex items-center justify-center"
                        style={{ 
                            flex: 1,
                            overflow: 'hidden',
                            minHeight: 0
                        }}
                    >
                        {mediaItems.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrevious}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2 z-20 transition-colors"
                                    title="Ảnh trước"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>

                                <button
                                    onClick={handleNext}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2 z-20 transition-colors"
                                    title="Ảnh tiếp theo"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}

                        <div 
                            className="w-full h-full flex  justify-center"
                            style={{ 
                                overflow: 'hidden'
                            }}
                        >
                            {currentMedia.type === 'image' ? (
                                <img
                                    src={currentMedia.url}
                                    alt={`Media ${currentIndex + 1}`}
                                    style={{ 
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        width: 'auto',
                                        height: 'auto',
                                        objectFit: 'contain'
                                    }}
                                />
                            ) : (
                                <video
                                    ref={videoRef}
                                    controls
                                    style={{ 
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        width: 'auto',
                                        height: 'auto',
                                        objectFit: 'contain'
                                    }}
                                >
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>

                        {mediaItems.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-2 z-20 bg-black bg-opacity-50 px-3 py-2 rounded-full max-w-[90%] overflow-x-auto">
                                {mediaItems.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`w-2 h-2 rounded-full transition-all flex-shrink-0 ${
                                            index === currentIndex
                                                ? "bg-blue-500 w-6"
                                                : "bg-white bg-opacity-70 hover:bg-opacity-100"
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div 
                        className="px-4 py-1 bg-white border-t border-gray-200 flex justify-end"
                        style={{ flexShrink: 0}}
                    >
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            onClick={onClose}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default MediaPreviewModal;
