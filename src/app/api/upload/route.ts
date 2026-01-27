import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

        // Validate File Types
        const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const documentTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
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

        // Validate File Size
        // Cloudinary handles large files well, but let's keep reasonable limits
        // 5MB for images, 10MB for documents
        const maxSize = folder === 'submissions' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;

        if (file.size > maxSize) {
            return NextResponse.json(
                { error: `File size exceeds ${folder === 'submissions' ? '10MB' : '5MB'} limit` },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary using a Promise wrapper
        const result = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: `ai-institute/${folder}`, // Organize uploads in folders
                    resource_type: 'auto', // Automatically detect image vs raw (pdf/docs)
                    use_filename: true,
                    unique_filename: true,
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            // Write buffer to stream
            uploadStream.end(buffer);
        });

        // Return the secure Cloudinary URL
        return NextResponse.json({
            success: true,
            url: result.secure_url,
            filename: result.original_filename,
            format: result.format,
            public_id: result.public_id
        });

    } catch (error: any) {
        console.error('Cloudinary upload error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to upload file' },
            { status: 500 }
        );
    }
}

// Next.js configuration for API route
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb' // Match our max file size limit
        }
    }
};
