"use client";

import React, { useEffect, useState } from 'react';
import { Loader2, Video, VideoOff, PhoneOff, RefreshCw, X } from 'lucide-react';

interface ZoomMeetingEmbedProps {
    meetingNumber: string;
    signature: string;
    sdkKey: string;
    userName: string;
    userEmail: string;
    password?: string;
    onLeave?: () => void;
}

export default function ZoomMeetingEmbed({
    meetingNumber,
    signature,
    sdkKey,
    userName,
    userEmail,
    password,
    onLeave
}: ZoomMeetingEmbedProps) {
    const [meetingUrl, setMeetingUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Build the meeting URL with all parameters
        // Using static HTML page to avoid React version conflicts
        const params = new URLSearchParams({
            meetingNumber,
            signature,
            sdkKey,
            userName,
            userEmail,
            password: password || ''
        });

        setMeetingUrl(`/zoom-meeting.html?${params.toString()}`);
    }, [meetingNumber, signature, sdkKey, userName, userEmail, password]);

    // Listen for messages from the iframe (meeting ended, etc.)
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'zoom-meeting-ended') {
                onLeave?.();
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [onLeave]);

    const handleIframeLoad = () => {
        // Give a small delay for the Zoom SDK to initialize
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    };

    const handleIframeError = () => {
        setError('Failed to load the meeting. Please try again.');
        setIsLoading(false);
    };

    if (error) {
        return (
            <div className="relative w-full h-[600px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500 rounded-full blur-3xl" />
                </div>
                <div className="text-center p-8 relative z-10">
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                        <VideoOff className="w-10 h-10 text-red-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Unable to Join Meeting</h3>
                    <p className="text-slate-400 mb-8 max-w-md">{error}</p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => {
                                setError(null);
                                setIsLoading(true);
                            }}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all flex items-center gap-2"
                        >
                            <RefreshCw size={18} />
                            Try Again
                        </button>
                        <button
                            onClick={onLeave}
                            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[600px] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
            {/* Loading overlay */}
            {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-indigo-900 flex items-center justify-center z-50">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse" />
                    </div>
                    <div className="text-center relative z-10">
                        <div className="relative mb-8">
                            <div className="w-24 h-24 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Video className="w-8 h-8 text-indigo-400" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Joining Live Class</h3>
                        <p className="text-slate-400 mb-2">Connecting to Zoom...</p>
                        <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Setting up video and audio</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Zoom Meeting iframe - isolated React context */}
            {meetingUrl && (
                <iframe
                    src={meetingUrl}
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
                    className="w-full h-full border-none"
                    style={{
                        minHeight: '600px',
                        backgroundColor: '#0f172a'
                    }}
                    title="Zoom Live Class"
                />
            )}

            {/* Leave button overlay */}
            {!isLoading && (
                <button
                    onClick={onLeave}
                    className="absolute top-4 right-4 z-50 px-4 py-2.5 bg-red-500/90 hover:bg-red-600 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg backdrop-blur-sm border border-red-400/30"
                >
                    <X size={18} />
                    Leave Class
                </button>
            )}
        </div>
    );
}
