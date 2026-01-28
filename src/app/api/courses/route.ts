import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Course from '@/models/Course';
import { courseSeedData } from '@/lib/seed-courses';

// GET all published courses (for public)
export async function GET(req: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const slug = searchParams.get('slug');
        const includeDrafts = searchParams.get('includeDrafts') === 'true';

        // If slug is provided, return single course (exclude deleted)
        if (slug) {
            const course = await Course.findOne({ slug, isDeleted: { $ne: true } });
            if (!course) {
                return NextResponse.json(
                    { message: 'Course not found' },
                    { status: 404 }
                );
            }
            return NextResponse.json({ course });
        }

        // Return all courses (optionally filter by published, exclude deleted)
        const query: any = { isDeleted: { $ne: true } };
        if (!includeDrafts) {
            query.isPublished = true;
        }
        const courses = await Course.find(query).sort({ createdAt: -1 });

        return NextResponse.json({ courses });

    } catch (error: any) {
        console.error('Error fetching courses:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to fetch courses' },
            { status: 500 }
        );
    }
}

// POST - Seed courses or create new
export async function POST(req: Request) {
    try {
        await dbConnect();

        const body = await req.json();

        // Special action: seed database
        if (body.action === 'seed') {
            // Check if courses already exist
            const existingCount = await Course.countDocuments();
            if (existingCount > 0 && !body.force) {
                return NextResponse.json({
                    message: `Database already has ${existingCount} courses. Use force: true to reseed.`,
                    coursesCount: existingCount
                });
            }

            // Clear existing and insert seed data
            if (body.force) {
                await Course.deleteMany({});
            }

            const courses = await Course.insertMany(courseSeedData);

            return NextResponse.json({
                message: `Successfully seeded ${courses.length} courses`,
                courses
            }, { status: 201 });
        }

        // Regular course creation
        const courseData = body;
        const slug = courseData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const newCourse = new Course({
            ...courseData,
            slug
        });

        await newCourse.save();

        return NextResponse.json(
            { message: 'Course created successfully', course: newCourse },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Error creating course:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to create course' },
            { status: 500 }
        );
    }
}
