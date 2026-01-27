"use client";

import React, { useEffect, useState } from 'react';

interface ZoomEmbedProps {
    meetingNumber: string;
    signature: string;
    sdkKey: string;
    userName: string;
    userEmail: string;
    password?: string;
    leaveUrl: string;
}

export default function ZoomEmbed({
    meetingNumber,
    signature,
    sdkKey,
    userName,
    userEmail,
    password,
    leaveUrl
}: ZoomEmbedProps) {
    const [meetingUrl, setMeetingUrl] = useState('');

    useEffect(() => {
        const params = new URLSearchParams({
            meetingNumber,
            signature,
            sdkKey,
            userName,
            userEmail,
            leaveUrl,
            password: password || ''
        });
        setMeetingUrl(`/meeting?${params.toString()}`);
    }, [meetingNumber, signature, sdkKey, userName, userEmail, password, leaveUrl]);

    return (
        <div className="relative w-full h-[600px] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
            {meetingUrl && (
                <iframe
                    src={meetingUrl}
                    allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
                    className="w-full h-full border-none"
                    sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
                    title="Zoom Meeting"
                />
            )}
        </div>
    );
}
