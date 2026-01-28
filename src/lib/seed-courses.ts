// Course seed data matching the website
export const courseSeedData = [
    {
        title: "AI-Driven Web Development",
        slug: "ai-driven-web-development",
        subtitle: "Build Real Websites with AI Assistance",
        description: "Learn by doing — build and deploy real websites using AI-assisted development tools and techniques.",
        longDescription: "Master the art of building modern websites with the help of AI tools. From design to deployment, learn how to leverage AI assistants to write better code, debug faster, and create stunning user interfaces.",
        price: 299,
        currency: "USD",
        level: "Beginner" as const,
        duration: "8 Weeks",
        category: "Web Development",
        thumbnail: "https://res.cloudinary.com/dmyfhma41/image/upload/v1769575339/ai-institute/courses/ai-driven-web-dev-cover.jpg",
        instructor: {
            name: "AI Institute Team",
            bio: "Expert instructors with years of industry experience",
            avatar: "/instructors/team.jpg"
        },
        modules: [
            {
                id: "mod-1",
                title: "Introduction to AI-Assisted Development",
                description: "Get started with AI coding assistants",
                order: 1,
                lessons: [
                    { id: "les-1-1", title: "What is AI-Assisted Development?", duration: "15 min", order: 1 },
                    { id: "les-1-2", title: "Setting Up Your AI Tools", duration: "20 min", order: 2 },
                    { id: "les-1-3", title: "Your First AI-Generated Code", duration: "25 min", order: 3 },
                    { id: "les-1-4", title: "Best Practices for AI Prompts", duration: "20 min", order: 4 }
                ]
            },
            {
                id: "mod-2",
                title: "Building with Next.js & AI",
                description: "Create modern React applications",
                order: 2,
                lessons: [
                    { id: "les-2-1", title: "Next.js Fundamentals", duration: "30 min", order: 1 },
                    { id: "les-2-2", title: "Components with AI Assistance", duration: "25 min", order: 2 },
                    { id: "les-2-3", title: "Styling with Tailwind CSS", duration: "20 min", order: 3 },
                    { id: "les-2-4", title: "Adding Animations", duration: "25 min", order: 4 },
                    { id: "les-2-5", title: "Responsive Design", duration: "20 min", order: 5 }
                ]
            },
            {
                id: "mod-3",
                title: "Backend & Database",
                description: "Connect your frontend to real data",
                order: 3,
                lessons: [
                    { id: "les-3-1", title: "API Routes in Next.js", duration: "25 min", order: 1 },
                    { id: "les-3-2", title: "MongoDB Integration", duration: "30 min", order: 2 },
                    { id: "les-3-3", title: "Authentication Basics", duration: "35 min", order: 3 },
                    { id: "les-3-4", title: "CRUD Operations", duration: "30 min", order: 4 }
                ]
            },
            {
                id: "mod-4",
                title: "Deployment & Beyond",
                description: "Ship your projects to production",
                order: 4,
                lessons: [
                    { id: "les-4-1", title: "Deploying to Vercel", duration: "20 min", order: 1 },
                    { id: "les-4-2", title: "Custom Domains & SSL", duration: "15 min", order: 2 },
                    { id: "les-4-3", title: "Performance Optimization", duration: "25 min", order: 3 },
                    { id: "les-4-4", title: "Final Project Showcase", duration: "40 min", order: 4 }
                ]
            }
        ],
        features: [
            "24 Video Lessons",
            "8 Hands-on Projects",
            "AI Tool Access",
            "Certificate of Completion",
            "Lifetime Access",
            "Community Support"
        ],
        outcomes: [
            "Build production-ready websites with AI assistance",
            "Master modern web development tools and frameworks",
            "Deploy and maintain professional web applications",
            "Use AI to accelerate your development workflow"
        ],
        isPublished: true,
        enrolledCount: 245,
        rating: 4.9
    },
    {
        title: "AI Fundamentals for Everyone",
        slug: "ai-fundamentals-for-everyone",
        subtitle: "Understand AI Without the Complexity",
        description: "Master the basics of Artificial Intelligence, from neural networks to ethical considerations, in a beginner-friendly format.",
        longDescription: "This comprehensive course covers everything you need to understand AI, from basic concepts to advanced applications. No prior technical knowledge required.",
        price: 149,
        currency: "USD",
        level: "Beginner" as const,
        duration: "4 Weeks",
        category: "AI Foundations",
        thumbnail: "/courses/ai-fundamentals.jpg",
        instructor: {
            name: "AI Institute Team",
            bio: "Expert instructors with years of industry experience"
        },
        modules: [
            {
                id: "fund-mod-1",
                title: "What is Artificial Intelligence?",
                order: 1,
                lessons: [
                    { id: "fund-1-1", title: "History of AI", duration: "20 min", order: 1 },
                    { id: "fund-1-2", title: "Types of AI", duration: "25 min", order: 2 },
                    { id: "fund-1-3", title: "AI in Everyday Life", duration: "15 min", order: 3 }
                ]
            },
            {
                id: "fund-mod-2",
                title: "Machine Learning Basics",
                order: 2,
                lessons: [
                    { id: "fund-2-1", title: "What is Machine Learning?", duration: "25 min", order: 1 },
                    { id: "fund-2-2", title: "Supervised vs Unsupervised Learning", duration: "30 min", order: 2 },
                    { id: "fund-2-3", title: "Training Models", duration: "25 min", order: 3 }
                ]
            },
            {
                id: "fund-mod-3",
                title: "Neural Networks & Deep Learning",
                order: 3,
                lessons: [
                    { id: "fund-3-1", title: "How Neural Networks Work", duration: "30 min", order: 1 },
                    { id: "fund-3-2", title: "Deep Learning Explained", duration: "25 min", order: 2 },
                    { id: "fund-3-3", title: "Real-World Applications", duration: "20 min", order: 3 }
                ]
            },
            {
                id: "fund-mod-4",
                title: "AI Ethics & Future",
                order: 4,
                lessons: [
                    { id: "fund-4-1", title: "Ethical Considerations", duration: "25 min", order: 1 },
                    { id: "fund-4-2", title: "AI Bias and Fairness", duration: "20 min", order: 2 },
                    { id: "fund-4-3", title: "The Future of AI", duration: "25 min", order: 3 }
                ]
            }
        ],
        features: [
            "12 Video Lessons",
            "Interactive Quizzes",
            "Downloadable Resources",
            "Certificate of Completion",
            "Lifetime Access"
        ],
        outcomes: [
            "Understand core AI concepts and terminology",
            "Explain how machine learning works",
            "Identify AI applications in various industries",
            "Discuss ethical implications of AI"
        ],
        isPublished: true,
        enrolledCount: 512,
        rating: 4.8
    },
    {
        title: "AI-Powered Content Creation",
        slug: "ai-powered-content-creation",
        subtitle: "Create Stunning Content with AI Tools",
        description: "Create stunning content with AI tools for social media, blogs, marketing campaigns, and more.",
        longDescription: "Learn to leverage AI tools like ChatGPT, Midjourney, and others to create professional content that engages your audience and drives results.",
        price: 199,
        currency: "USD",
        level: "Beginner" as const,
        duration: "4 Weeks",
        category: "Content Creation",
        thumbnail: "/courses/ai-content.jpg",
        instructor: {
            name: "AI Institute Team",
            bio: "Expert instructors with years of industry experience"
        },
        modules: [
            {
                id: "content-mod-1",
                title: "AI Writing Tools",
                order: 1,
                lessons: [
                    { id: "content-1-1", title: "Introduction to AI Writing", duration: "20 min", order: 1 },
                    { id: "content-1-2", title: "Crafting Effective Prompts", duration: "25 min", order: 2 },
                    { id: "content-1-3", title: "Blog Post Generation", duration: "30 min", order: 3 }
                ]
            },
            {
                id: "content-mod-2",
                title: "AI Image Generation",
                order: 2,
                lessons: [
                    { id: "content-2-1", title: "Midjourney Fundamentals", duration: "25 min", order: 1 },
                    { id: "content-2-2", title: "DALL-E for Marketing", duration: "25 min", order: 2 },
                    { id: "content-2-3", title: "Creating Brand Visuals", duration: "30 min", order: 3 }
                ]
            },
            {
                id: "content-mod-3",
                title: "Social Media Content",
                order: 3,
                lessons: [
                    { id: "content-3-1", title: "AI for Social Media Strategy", duration: "25 min", order: 1 },
                    { id: "content-3-2", title: "Automated Post Generation", duration: "20 min", order: 2 },
                    { id: "content-3-3", title: "Engagement Optimization", duration: "25 min", order: 3 }
                ]
            },
            {
                id: "content-mod-4",
                title: "Video & Audio Content",
                order: 4,
                lessons: [
                    { id: "content-4-1", title: "AI Video Editing", duration: "30 min", order: 1 },
                    { id: "content-4-2", title: "Voice Synthesis", duration: "20 min", order: 2 },
                    { id: "content-4-3", title: "Podcast Production with AI", duration: "25 min", order: 3 }
                ]
            }
        ],
        features: [
            "12 Video Lessons",
            "10+ AI Tool Tutorials",
            "Template Library",
            "Certificate of Completion",
            "Lifetime Access"
        ],
        outcomes: [
            "Create professional content using AI tools",
            "Generate engaging social media posts",
            "Design stunning visuals with AI",
            "Automate content workflows"
        ],
        isPublished: true,
        enrolledCount: 189,
        rating: 4.7
    }
];
