"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize, Users } from "lucide-react";

interface VideoSectionProps {
    videoUrl?: string; // YouTube, Vimeo URL or local video path
    posterImage?: string; // Thumbnail image
}

export function VideoSection({
    videoUrl = "", // Default empty - will show placeholder
    posterImage = ""
}: VideoSectionProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    // Update progress as video plays
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
            setProgress((video.currentTime / video.duration) * 100);
        };

        const handleLoadedMetadata = () => {
            setDuration(video.duration);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setProgress(0);
            setCurrentTime(0);
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('ended', handleEnded);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('ended', handleEnded);
        };
    }, []);

    // Format time in MM:SS
    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Handle seeking when clicking on progress bar
    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!videoRef.current || !progressRef.current) return;

        const rect = progressRef.current.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const percentage = clickPosition / rect.width;
        const newTime = percentage * videoRef.current.duration;

        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
        setProgress(percentage * 100);
    };

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        } else if (videoUrl) {
            // For YouTube/Vimeo, just toggle the state
            setIsPlaying(!isPlaying);
        }
    };

    const handleMuteToggle = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
        }
        setIsMuted(!isMuted);
    };

    const handleFullscreen = () => {
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            }
        }
    };

    // Check if it's a YouTube URL
    const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
    const isVimeo = videoUrl.includes("vimeo.com");

    // Extract YouTube video ID
    const getYouTubeId = (url: string) => {
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        return match ? match[1] : "";
    };

    // Extract Vimeo video ID
    const getVimeoId = (url: string) => {
        const match = url.match(/vimeo\.com\/(\d+)/);
        return match ? match[1] : "";
    };

    return (
        <section className="relative py-24 px-6 md:px-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm mb-6">
                        <Users className="w-4 h-4" />
                        Meet Our Team
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                        The Minds Behind{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                            AI_INST.
                        </span>
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Watch our team share their vision for the future of artificial intelligence and how we're making it accessible to everyone.
                    </p>
                </motion.div>

                {/* Video Container */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="relative"
                >
                    {/* Glow Effect */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary via-secondary to-accent opacity-20 blur-2xl rounded-3xl" />

                    {/* Video Frame */}
                    <div
                        className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800"
                        onMouseEnter={() => setShowControls(true)}
                        onMouseLeave={() => setShowControls(false)}
                    >
                        {/* Aspect Ratio Container */}
                        <div className="aspect-video relative">
                            {/* Video Content */}
                            {videoUrl ? (
                                isYouTube ? (
                                    // YouTube Embed
                                    <iframe
                                        src={`https://www.youtube.com/embed/${getYouTubeId(videoUrl)}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&rel=0`}
                                        className="absolute inset-0 w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : isVimeo ? (
                                    // Vimeo Embed
                                    <iframe
                                        src={`https://player.vimeo.com/video/${getVimeoId(videoUrl)}?autoplay=${isPlaying ? 1 : 0}&muted=${isMuted ? 1 : 0}&controls=0`}
                                        className="absolute inset-0 w-full h-full"
                                        allow="autoplay; fullscreen; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    // Local/Direct Video
                                    <video
                                        ref={videoRef}
                                        src={videoUrl}
                                        poster={posterImage}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        playsInline
                                    />
                                )
                            ) : (
                                // Placeholder when no video URL
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 flex items-center justify-center">
                                    {/* Decorative Pattern */}
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute top-10 left-10 w-40 h-40 border border-white rounded-full" />
                                        <div className="absolute bottom-10 right-10 w-32 h-32 border border-white rounded-full" />
                                        <div className="absolute top-1/2 left-1/4 w-20 h-20 border border-white rounded-full" />
                                    </div>

                                    {/* Placeholder Content */}
                                    <div className="text-center z-10">
                                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                                            <Play className="w-10 h-10 text-white ml-1" />
                                        </div>
                                        <p className="text-white/60 text-lg mb-2">Team Introduction Video</p>
                                        <p className="text-white/40 text-sm">Coming Soon</p>
                                    </div>
                                </div>
                            )}

                            {/* Play Button Overlay (shown when video is not playing) */}
                            <AnimatePresence>
                                {!isPlaying && videoUrl && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer z-10"
                                        onClick={handlePlayPause}
                                    >
                                        {/* Poster Image */}
                                        {posterImage && (
                                            <img
                                                src={posterImage}
                                                alt="Video thumbnail"
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-black/40" />

                                        {/* Play Button */}
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="relative z-10"
                                        >
                                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/30">
                                                <Play className="w-10 h-10 md:w-12 md:h-12 text-white ml-2" />
                                            </div>
                                            <motion.div
                                                animate={{ scale: [1, 1.3, 1] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                                className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary opacity-30"
                                            />
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Custom Controls (shown on hover when playing) */}
                            <AnimatePresence>
                                {showControls && isPlaying && !isYouTube && !isVimeo && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-20"
                                    >
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={handlePlayPause}
                                                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                                            >
                                                {isPlaying ? (
                                                    <Pause className="w-5 h-5 text-white" />
                                                ) : (
                                                    <Play className="w-5 h-5 text-white ml-0.5" />
                                                )}
                                            </button>

                                            {/* Time Display */}
                                            <span className="text-white/80 text-sm min-w-[45px]">
                                                {formatTime(currentTime)}
                                            </span>

                                            {/* Progress Bar - Now Clickable */}
                                            <div
                                                ref={progressRef}
                                                onClick={handleSeek}
                                                className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer group"
                                            >
                                                <div
                                                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-100 relative"
                                                    style={{ width: `${progress}%` }}
                                                >
                                                    {/* Seek Handle */}
                                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
                                                </div>
                                            </div>

                                            {/* Duration Display */}
                                            <span className="text-white/80 text-sm min-w-[45px]">
                                                {formatTime(duration)}
                                            </span>

                                            <button
                                                onClick={handleMuteToggle}
                                                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                                            >
                                                {isMuted ? (
                                                    <VolumeX className="w-5 h-5 text-white" />
                                                ) : (
                                                    <Volume2 className="w-5 h-5 text-white" />
                                                )}
                                            </button>

                                            <button
                                                onClick={handleFullscreen}
                                                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                                            >
                                                <Maximize className="w-5 h-5 text-white" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                {/* Caption Below Video */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 text-center"
                >

                </motion.div>
            </div>
        </section>
    );
}
