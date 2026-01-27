import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const folder = formData.get('folder') as string || 'uploads';

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Define allowed file types based on folder
        const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const documentTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'application/zip',
            'application/x-zip-compressed'
        ];

        // Allow more file types for submissions
        const allowedTypes = folder === 'submissions'
            ? [...imageTypes, ...documentTypes]
            : imageTypes;

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                {
                    error: folder === 'submissions'
                        ? 'Invalid file type. Allowed: Images, PDF, DOC, DOCX, TXT, ZIP'
                        : 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'
                },
                { status: 400 }
            );
        }

        // Max file size: 5MB for images, 10MB for submissions
        const maxSize = folder === 'submissions' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: `File size exceeds ${folder === 'submissions' ? '10MB' : '5MB'} limit` },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const extension = file.name.split('.').pop() || 'jpg';
        const filename = `${timestamp}-${randomString}.${extension}`;

        // Create uploads directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public', folder);
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Save file
        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        // Return the public URL
        const url = `/${folder}/${filename}`;

        return NextResponse.json({
            success: true,
            url,
            filename
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}

// Configure Next.js to handle larger request bodies
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb'
        }
    }
};
