import React, { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
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

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
            <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                aria-hidden="true"
            ></div>

            <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
            >
                &#8203;
            </span>

            <div 
                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-white">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900">
                            Xem phương tiện ({currentIndex + 1}/{mediaItems.length})
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="relative bg-black" style={{ height: '400px' }}>
                        {mediaItems.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrevious}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2 z-10"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>

                                <button
                                    onClick={handleNext}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2 z-10"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}

                        <div className="w-full h-full flex items-center justify-center">
                            {currentMedia.type === 'image' ? (
                                <img
                                    src={currentMedia.url}
                                    alt={`Media ${currentIndex + 1}`}
                                    className="max-w-full max-h-full object-contain"
                                />
                            ) : (
                                <video
                                    ref={videoRef}
                                    controls
                                    className="max-w-full max-h-full"
                                >
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
                    </div>

                    {mediaItems.length > 1 && (
                        <div className="px-4 py-3 bg-gray-50 flex justify-center gap-2">
                            {mediaItems.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${
                                        index === currentIndex
                                            ? "bg-blue-600 w-6"
                                            : "bg-gray-300 hover:bg-gray-400"
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MediaPreviewModal;
