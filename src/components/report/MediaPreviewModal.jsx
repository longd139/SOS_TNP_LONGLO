import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Hls from "hls.js";
import BaseModal, { ModalFooter } from "../base/BaseModal";

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
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={`Xem phương tiện (${currentIndex + 1}/${mediaItems.length})`}
            size="3xl"
            className="max-w-5xl"
            footer={
                <div className="flex justify-end">
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                        onClick={onClose}
                    >
                        Đóng
                    </button>
                </div>
            }
            showCloseButton={true}
            contentPadding={false}
        >
            <div className="relative bg-black overflow-hidden" style={{ height: 'min(70vh, calc(100vh - 200px))', maxHeight: 'min(70vh, calc(100vh - 200px))' }}>
                {mediaItems.length > 1 && (
                    <>
                        <button
                            onClick={handlePrevious}
                            className="absolute left-1 sm:left-2 md:left-3 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-1 sm:p-1.5 md:p-2 z-20 min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center"
                            title="Ảnh trước"
                        >
                            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                        </button>

                        <button
                            onClick={handleNext}
                            className="absolute right-1 sm:right-2 md:right-3 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-1 sm:p-1.5 md:p-2 z-20 min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center"
                            title="Ảnh tiếp theo"
                        >
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                        </button>
                    </>
                )}

                <div className="w-full h-full flex items-center justify-center overflow-hidden">
                    {currentMedia.type === 'image' ? (
                        <img
                            src={currentMedia.url}
                            alt={`Media ${currentIndex + 1}`}
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <video
                            ref={videoRef}
                            controls
                            className="w-full h-full object-contain"
                        >
                            Your browser does not support the video tag.
                        </video>
                    )}
                </div>

                {mediaItems.length > 1 && (
                    <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-1.5 sm:gap-2 z-20 bg-black bg-opacity-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full max-w-[90vw] overflow-hidden">
                        {mediaItems.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all flex-shrink-0 ${index === currentIndex
                                    ? "bg-blue-500 w-4 sm:w-6"
                                    : "bg-white bg-opacity-70 hover:bg-opacity-100"
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </BaseModal>
    );
};

export default MediaPreviewModal;
