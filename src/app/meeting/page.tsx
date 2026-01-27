"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, Video, VideoOff, AlertCircle } from 'lucide-react';

function MeetingContent() {
    const searchParams = useSearchParams();
    const meetingNumber = searchParams.get('meetingNumber');
    const signature = searchParams.get('signature');
    const sdkKey = searchParams.get('sdkKey');
    const userName = searchParams.get('userName');
    const userEmail = searchParams.get('userEmail');
    const password = searchParams.get('password');

    const [status, setStatus] = useState<'loading' | 'joining' | 'joined' | 'error'>('loading');
    const [error, setError] = useState('');

    useEffect(() => {
        const initMeeting = async () => {
            if (!meetingNumber || !signature || !sdkKey) {
                setError('Missing meeting parameters');
                setStatus('error');
                return;
            }

            try {
                setStatus('joining');

                // Dynamically import Zoom SDK - this runs in an isolated context (iframe)
                const { default: ZoomMtgEmbedded } = await import('@zoom/meetingsdk/embedded');
                const client = ZoomMtgEmbedded.createClient();

                const meetingSDKElement = document.getElementById('meetingSDKElement');
                if (!meetingSDKElement) {
                    throw new Error('Meeting container not found');
                }

                // Initialize the client
                await client.init({
                    zoomAppRoot: meetingSDKElement,
                    language: 'en-US',
                    patchJsMedia: true,
                    customize: {
                        meetingInfo: [
                            'topic',
                            'host',
                            'mn',
                            'participant',
                            'dc',
                            'enctype'
                        ],
                        video: {
                            isResizable: true,
                            viewSizes: {
                                default: {
                                    width: 1000,
                                    height: 600
                                },
                                ribbon: {
                                    width: 300,
                                    height: 600
                                }
                            },
                            popper: {
                                disableDraggable: false
                            }
                        }
                    }
                });

                // Join the meeting
                await client.join({
                    signature: signature,
                    sdkKey: sdkKey,
                    meetingNumber: meetingNumber,
                    password: password || '',
                    userName: userName || 'Guest',
                    userEmail: userEmail || '',
                    tk: '',
                    zak: ''
                });

                setStatus('joined');

                // Listen for connection changes
                client.on('connection-change', (payload: { state: string }) => {
                    console.log('Connection change:', payload);
                    if (payload.state === 'Closed' || payload.state === 'Fail') {
                        // Notify parent window if in iframe
                        if (window.parent !== window) {
                            window.parent.postMessage({ type: 'zoom-meeting-ended' }, '*');
                        }
                    }
                });

            } catch (err: any) {
                console.error('Zoom SDK Error:', err);

                let errorMessage = 'Failed to join meeting';
                if (err.message?.includes('signature')) {
                    errorMessage = 'Invalid meeting signature';
                } else if (err.errorCode === 200) {
                    errorMessage = 'Meeting has not started yet. Please wait for the host.';
                } else if (err.errorCode === 3712) {
                    errorMessage = 'Meeting number is invalid';
                } else if (err.message) {
                    errorMessage = err.message;
                }

                setError(errorMessage);
                setStatus('error');
            }
        };

        initMeeting();
    }, [meetingNumber, signature, sdkKey, userName, userEmail, password]);

    // Error state
    if (status === 'error') {
        return (
            <div className="w-full h-full min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                <div className="text-center p-8">
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                        <VideoOff className="w-10 h-10 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Unable to Join Meeting</h2>
                    <p className="text-slate-400 mb-6 max-w-md">{error}</p>
                    <div className="flex items-center justify-center gap-2 text-amber-400 text-sm bg-amber-500/10 px-4 py-2 rounded-lg">
                        <AlertCircle size={16} />
                        <span>Please close this window and try again</span>
                    </div>
                </div>
            </div>
        );
    }

    // Loading/Joining state
    if (status === 'loading' || status === 'joining') {
        return (
            <div className="w-full h-full min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 flex items-center justify-center">
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
                    <h2 className="text-2xl font-bold text-white mb-3">
                        {status === 'loading' ? 'Preparing Meeting...' : 'Joining Live Class'}
                    </h2>
                    <p className="text-slate-400 mb-2">
                        {status === 'loading' ? 'Initializing Zoom SDK' : 'Connecting to Zoom...'}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>This may take a few seconds</span>
                    </div>
                </div>
                {/* Hidden container for SDK to initialize */}
                <div id="meetingSDKElement" className="absolute inset-0 opacity-0 pointer-events-none" />
            </div>
        );
    }

    // Joined state - show meeting
    return (
        <div className="w-full h-full min-h-screen bg-black">
            <div
                id="meetingSDKElement"
                className="w-full h-full"
                style={{
                    width: '100vw',
                    height: '100vh',
                    minHeight: '100vh'
                }}
            />
        </div>
    );
}

export default function MeetingPage() {
    return (
        <Suspense fallback={
            <div className="w-full h-full min-h-screen bg-slate-900 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        }>
            <MeetingContent />
        </Suspense>
    );
}
