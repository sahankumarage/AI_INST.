import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    Calendar,
    Star,
    ArrowRight,
    Users,
    Award,
    BookOpen,
    Play,
    Download,
    MessageCircle,
    Globe,
    Zap,
    Target,
    GraduationCap,
    ChevronDown,
    Video
} from "lucide-react";

export const courseData: Record<string, any> = {
    "ai-driven-web-development": {
        title: "AI-Driven Web Development",
        subtitle: "8-Week Live Online Course — Learn by Doing",
        description: "Learn by doing — build and deploy real websites using AI-assisted development. No prior experience required.",
        longDescription: "This course is built on one principle: you learn web development by building websites, not by reading about them. Every week, you will join a live online session where you'll create something real. Technical concepts are taught through analogies and discovered through hands-on activities. By the end, you'll have multiple websites deployed and live on the internet.",
        thumbnail: "/courses/ai-driven-web-dev-cover.png",
        duration: "8 Weeks",
        price: 15000,
        level: "Beginner",
        sessions: 8,
        isLiveCourse: true,
        gradient: "from-indigo-500 to-violet-500",
        instructor: {
            name: "Course Instructor",
            role: "Web Development Specialist",
            image: "/instructors/web-dev.jpg"
        },
        features: [
            { icon: Play, text: "8 live interactive sessions" },
            { icon: MessageCircle, text: "Real-time Q&A with instructor" },
            { icon: Download, text: "Code templates & resources" },
            { icon: Users, text: "Small batch for personalized attention" },
            { icon: Award, text: "Certificate of completion" },
            { icon: Globe, text: "Deploy real websites" },
        ],
        syllabus: [
            {
                week: "Session 01",
                title: "Your First Web Page",
                description: "Understand the basics and build your first web page by the end of class",
                topics: ["The Internet (Restaurant Analogy)", "HTML Structure", "CSS Styling", "JavaScript Basics", "Build a Personal Page"],
                duration: "3 hours"
            },
            {
                week: "Session 02",
                title: "Enter the AI Assistant",
                description: "Rebuild your Week 1 page using AI — faster and better",
                topics: ["What is an Agentic IDE?", "AI-Built Pages", "The Art of Prompting", "Good vs Bad Prompts", "Prompt Formula"],
                duration: "3 hours"
            },
            {
                week: "Session 03",
                title: "Introduction to Next.js",
                description: "Understand how Next.js works and why it's useful",
                topics: ["Why Next.js? (Construction Analogy)", "Components (LEGO Analogy)", "File Structure", "Page Routing", "First Next.js Project"],
                duration: "3 hours"
            },
            {
                week: "Session 04",
                title: "Building with Next.js",
                description: "Build a complete multi-page website using AI assistance",
                topics: ["Navigation Component", "Home Page", "About Page", "Services Page", "Contact Page", "Footer Component"],
                duration: "3 hours"
            },
            {
                week: "Session 05",
                title: "Review and Refinement",
                description: "Review student work, answer questions, and improve projects",
                topics: ["Homework Showcase", "Common Issues Workshop", "Q&A Deep Dive", "Styling Enhancement", "Typography & Colors"],
                duration: "3 hours"
            },
            {
                week: "Session 06",
                title: "Git, GitHub, and Vercel",
                description: "Understand version control and deploy your first site",
                topics: ["What is Git?", "What is GitHub?", "Git Commands", "Connect to Vercel", "Continuous Deployment"],
                duration: "3 hours"
            },
            {
                week: "Session 07",
                title: "Build and Deploy from Scratch",
                description: "Apply everything — build a new site and deploy it in one session",
                topics: ["Project Planning", "Setup & GitHub", "Build with AI", "Deploy to Vercel", "Show and Tell"],
                duration: "3 hours"
            },
            {
                week: "Session 08",
                title: "A Glimpse to the Future",
                description: "See what's possible next and plan your continued learning journey",
                topics: ["Course Reflection", "Databases (Supabase)", "Authentication", "APIs", "Learning Path", "Final Showcase"],
                duration: "3 hours"
            }
        ],
        outcomes: [
            "Build websites from scratch with HTML, CSS, and JavaScript",
            "Use AI assistants to accelerate development",
            "Create modern web apps with Next.js",
            "Master Git version control and GitHub",
            "Deploy live websites on Vercel",
            "Write effective AI prompts for coding"
        ],
        whoIsThisFor: [
            { title: "Complete Beginners", description: "No prior coding experience needed" },
            { title: "Career Changers", description: "Transition into web development" },
            { title: "Entrepreneurs", description: "Build your own websites and apps" },
            { title: "Curious Minds", description: "Anyone interested in AI-assisted development" },
        ]
    },
    "ai-fundamentals-for-everyone": {
        title: "AI Fundamentals for Everyone",
        subtitle: "Your gateway to understanding artificial intelligence",
        description: "Master the basics of Artificial Intelligence, from neural networks to ethical considerations. No coding experience required.",
        longDescription: "This comprehensive course bridges the gap between technical AI concepts and real-world understanding. Whether you're a business leader looking to understand the impact of AI, or an enthusiast wanting to grasp the mechanics of neural networks, this course provides a solid foundation without getting lost in complex mathematics or code.",
        duration: "4 Weeks",
        price: 10000,
        level: "Beginner",
        rating: 4.8,
        students: "2,500+",
        lessons: 24,
        gradient: "from-blue-500 to-cyan-500",
        instructor: {
            name: "Dr. Sarah Chen",
            role: "AI Research Lead",
            image: "/instructors/sarah.jpg"
        },
        features: [
            { icon: BookOpen, text: "24 in-depth lessons" },
            { icon: Play, text: "12 hours of video content" },
            { icon: Download, text: "Downloadable resources" },
            { icon: MessageCircle, text: "Community access" },
            { icon: Award, text: "Certificate of completion" },
            { icon: Globe, text: "Lifetime access" },
        ],
        syllabus: [
            {
                week: "Week 01",
                title: "Demystifying AI",
                description: "Understand what AI really is and how it's changing the world",
                topics: ["History of AI", "Machine Learning vs Deep Learning", "The Neural Network Analogy", "Real-world Use Cases"],
                duration: "6 hours"
            },
            {
                week: "Week 02",
                title: "Generative AI Revolution",
                description: "Explore the technology behind ChatGPT and image generators",
                topics: ["How LLMs Work", "Prompt Engineering Basics", "Image Generation Models", "Limitations & Hallucinations"],
                duration: "6 hours"
            },
            {
                week: "Week 03",
                title: "AI Ethics & Safety",
                description: "Navigate the ethical considerations of AI development",
                topics: ["Bias in Algorithms", "Data Privacy", "The Alignment Problem", "Future of Work"],
                duration: "6 hours"
            },
            {
                week: "Week 04",
                title: "AI Strategy & Implementation",
                description: "Apply your knowledge to real-world scenarios",
                topics: ["Identifying Opportunities", "No-code AI Tools", "Building an AI Roadmap", "Final Project"],
                duration: "6 hours"
            }
        ],
        outcomes: [
            "Navigate the AI landscape with confidence",
            "Understand the mechanics of key AI models",
            "Evaluate AI tools for personal/business use",
            "Develop a framework for ethical AI decision making",
            "Create your own AI implementation roadmap",
            "Communicate AI concepts to stakeholders"
        ],
        whoIsThisFor: [
            { title: "Business Professionals", description: "Leaders wanting to understand AI's impact on their industry" },
            { title: "Entrepreneurs", description: "Founders looking to leverage AI in their startups" },
            { title: "Career Changers", description: "Professionals exploring opportunities in AI fields" },
            { title: "Curious Minds", description: "Anyone interested in understanding how AI works" },
        ]
    },
    "deep-learning-specialization": {
        title: "Deep Learning Specialization",
        subtitle: "Master neural networks from scratch",
        description: "Dive deep into the mathematics and architecture of modern neural networks. Build your own models from scratch.",
        longDescription: "An intensive engineering track designed for those who want to build the future. We go beyond the APIs and frameworks to understand the calculus and linear algebra that powers modern AI. You will build neural networks from scratch before moving to PyTorch and TensorFlow.",
        duration: "12 Weeks",
        price: 25000,
        level: "Advanced",
        rating: 4.9,
        students: "1,200+",
        lessons: 72,
        gradient: "from-violet-500 to-purple-500",
        instructor: {
            name: "Prof. Michael Park",
            role: "ML Engineering Lead",
            image: "/instructors/michael.jpg"
        },
        features: [
            { icon: BookOpen, text: "72 technical lessons" },
            { icon: Play, text: "48 hours of video" },
            { icon: Download, text: "Code repositories" },
            { icon: MessageCircle, text: "1-on-1 mentorship" },
            { icon: Award, text: "Industry certificate" },
            { icon: Globe, text: "Lifetime access" },
        ],
        syllabus: [
            { week: "Week 01-03", title: "Neural Networks & Deep Learning", description: "Build neural networks from first principles", topics: ["Logistic Regression", "Backpropagation", "Gradient Descent"], duration: "12 hours" },
            { week: "Week 04-06", title: "Convolutional Neural Networks", description: "Master computer vision architectures", topics: ["Edge Detection", "Padding & Strides", "ResNets", "Object Detection"], duration: "12 hours" },
            { week: "Week 07-09", title: "Sequence Models", description: "Handle sequential data with modern architectures", topics: ["RNNs & LSTMs", "Transformers", "Attention Mechanisms", "NLP Applications"], duration: "12 hours" },
            { week: "Week 10-12", title: "Generative Models", description: "Create AI that creates", topics: ["GANs", "Diffusion Models", "Fine-tuning LLMs", "Capstone Project"], duration: "12 hours" }
        ],
        outcomes: [
            "Master the math behind Neural Networks",
            "Build and deploy models using PyTorch",
            "Understand state-of-the-art architectures",
            "Complete a production-level Portfolio Project",
            "Contribute to open-source ML projects",
            "Interview confidently for ML engineering roles"
        ],
        whoIsThisFor: [
            { title: "Software Engineers", description: "Developers wanting to transition to ML" },
            { title: "Data Scientists", description: "Analysts seeking deeper technical skills" },
            { title: "Researchers", description: "Academics exploring practical ML" },
            { title: "AI Enthusiasts", description: "Self-learners with strong math background" },
        ]
    },
    "ai-powered-content-creation": {
        title: "AI-Powered Content Creation",
        subtitle: "Create Stunning Content with AI Tools",
        description: "Create stunning content with AI tools — from writing compelling copy to generating images and videos for social media, blogs, and marketing.",
        longDescription: "In this hands-on course, you'll master the art of creating professional content using the latest AI tools. From crafting viral social media posts to generating eye-catching images and editing videos with AI assistance, you'll learn everything you need to become a content creation powerhouse. No technical background required — just creativity and curiosity!",
        duration: "4 Weeks",
        price: 10000,
        level: "Beginner",
        rating: 4.8,
        students: "4,200+",
        lessons: 20,
        gradient: "from-rose-500 via-pink-500 to-orange-400",
        instructor: {
            name: "Content Creation Team",
            role: "AI Content Specialists",
            image: "/instructors/content.jpg"
        },
        features: [
            { icon: BookOpen, text: "20 practical lessons" },
            { icon: Play, text: "15 hours of video content" },
            { icon: Download, text: "100+ templates & prompts" },
            { icon: MessageCircle, text: "Community access" },
            { icon: Award, text: "Certificate of completion" },
            { icon: Globe, text: "Lifetime access" },
        ],
        syllabus: [
            {
                week: "Week 01",
                title: "AI Writing Mastery",
                description: "Learn to write compelling content with AI assistance",
                topics: ["ChatGPT & Claude for Writing", "Blog Post Creation", "Social Media Captions", "Email Copy that Converts", "SEO-Optimized Content"],
                duration: "4 hours"
            },
            {
                week: "Week 02",
                title: "AI Image Generation",
                description: "Create stunning visuals without design skills",
                topics: ["Midjourney Fundamentals", "DALL-E & Leonardo AI", "Prompt Engineering for Images", "Brand Consistent Visuals", "Editing & Upscaling"],
                duration: "4 hours"
            },
            {
                week: "Week 03",
                title: "Video & Audio AI",
                description: "Produce professional videos and audio content",
                topics: ["AI Video Editing Tools", "Text-to-Video Generation", "AI Voice & Narration", "Background Music with AI", "Podcast Enhancement"],
                duration: "4 hours"
            },
            {
                week: "Week 04",
                title: "Content Strategy & Workflow",
                description: "Build a sustainable AI-powered content system",
                topics: ["Content Calendar with AI", "Repurposing Content", "Brand Voice Consistency", "Automation Workflows", "Final Portfolio Project"],
                duration: "4 hours"
            }
        ],
        outcomes: [
            "Write engaging blog posts, emails, and social media content with AI",
            "Generate professional images using Midjourney and DALL-E",
            "Create and edit videos with AI-powered tools",
            "Build a consistent brand voice across all content",
            "Develop an efficient AI content creation workflow",
            "Launch a complete content portfolio"
        ],
        whoIsThisFor: [
            { title: "Content Creators", description: "Bloggers, YouTubers, and influencers wanting to scale" },
            { title: "Marketers", description: "Marketing professionals looking to boost productivity" },
            { title: "Entrepreneurs", description: "Business owners creating their own content" },
            { title: "Freelancers", description: "Writers and designers expanding their AI skills" },
        ]
    }
};
