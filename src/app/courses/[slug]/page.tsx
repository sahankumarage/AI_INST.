"use client";

import { motion } from "framer-motion";
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
    Shield
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

// Data Dictionary
const courseData: Record<string, any> = {
    "ai-fundamentals-for-everyone": {
        title: "AI Fundamentals for Everyone",
        subtitle: "Your gateway to understanding artificial intelligence",
        description: "Master the basics of Artificial Intelligence, from neural networks to ethical considerations. No coding experience required.",
        longDescription: "This comprehensive course bridges the gap between technical AI concepts and real-world understanding. Whether you're a business leader looking to understand the impact of AI, or an enthusiast wanting to grasp the mechanics of neural networks, this course provides a solid foundation without getting lost in complex mathematics or code.",
        duration: "4 Weeks",
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
    "generative-ai-and-llms": {
        title: "Generative AI & LLMs",
        subtitle: "Build production-ready AI applications",
        description: "Learn to fine-tune Large Language Models and build custom RAG pipelines for enterprise applications.",
        longDescription: "Focusing on the hottest topic in tech, this course is practical and hands-on. You will learn how to take open-source models like Llama and Mistral, fine-tune them on custom datasets, and build Retrieval-Augmented Generation (RAG) systems that don't hallucinate.",
        duration: "8 Weeks",
        level: "Intermediate",
        rating: 4.9,
        students: "3,100+",
        lessons: 48,
        gradient: "from-orange-500 to-red-500",
        instructor: {
            name: "Alex Rivera",
            role: "GenAI Specialist",
            image: "/instructors/alex.jpg"
        },
        features: [
            { icon: BookOpen, text: "48 practical lessons" },
            { icon: Play, text: "32 hours of content" },
            { icon: Download, text: "Production templates" },
            { icon: MessageCircle, text: "Discord community" },
            { icon: Award, text: "Verified certificate" },
            { icon: Globe, text: "Lifetime updates" },
        ],
        syllabus: [
            { week: "Week 01-02", title: "LLM Foundations", description: "Understand how language models work", topics: ["Transformer Architecture", "Tokenization", "Embeddings"], duration: "8 hours" },
            { week: "Week 03-04", title: "Prompt Engineering & RAG", description: "Build systems that don't hallucinate", topics: ["Advanced Prompting", "Vector Databases", "LangChain & LlamaIndex"], duration: "8 hours" },
            { week: "Week 05-06", title: "Fine-Tuning", description: "Customize models for your use case", topics: ["PEFT & LoRA", "Dataset Preparation", "Training on Consumer GPUs"], duration: "8 hours" },
            { week: "Week 07-08", title: "Deployment & Agents", description: "Ship AI to production", topics: ["Serving Models", "AutoGPT & Agents", "Evaluation Frameworks"], duration: "8 hours" }
        ],
        outcomes: [
            "Build custom RAG chatbots",
            "Fine-tune LLMs for specific domains",
            "Deploy models to production",
            "Understand the modern AI stack",
            "Create autonomous AI agents",
            "Evaluate and improve model outputs"
        ],
        whoIsThisFor: [
            { title: "Developers", description: "Engineers building AI-powered apps" },
            { title: "Product Managers", description: "PMs integrating AI into products" },
            { title: "Startup Founders", description: "Entrepreneurs building AI startups" },
            { title: "Tech Leads", description: "Leaders adopting AI in their teams" },
        ]
    },
    "ai-strategy-for-leaders": {
        title: "AI Strategy for Leaders",
        subtitle: "Transform your organization with AI",
        description: "For executives and managers: how to implement AI strategies that drive business value and ROI.",
        longDescription: "AI is an executive-level priority. This course equips decision-makers with the frameworks to assess AI maturity, identify high-value use cases, and manage the organizational change required for successful AI adoption.",
        duration: "3 Weeks",
        level: "Beginner",
        rating: 4.7,
        students: "890+",
        lessons: 15,
        gradient: "from-emerald-500 to-teal-500",
        instructor: {
            name: "Emma Williams",
            role: "AI Strategy Consultant",
            image: "/instructors/emma.jpg"
        },
        features: [
            { icon: BookOpen, text: "15 strategic lessons" },
            { icon: Play, text: "8 hours of content" },
            { icon: Download, text: "Strategy templates" },
            { icon: MessageCircle, text: "Executive network" },
            { icon: Award, text: "Leadership certificate" },
            { icon: Globe, text: "Quarterly updates" },
        ],
        syllabus: [
            { week: "Week 01", title: "The Executive AI Landscape", description: "Understand the current AI landscape and opportunities", topics: ["State of AI", "Hype vs Reality", "Competitor Analysis"], duration: "4 hours" },
            { week: "Week 02", title: "Strategic Implementation", description: "Make the right build vs buy decisions", topics: ["Build vs Buy", "Talent & Hiring", "Risk Management"], duration: "4 hours" },
            { week: "Week 03", title: "Future-Proofing", description: "Prepare your organization for the AI future", topics: ["AI Governance", "Scalability", "Case Studies"], duration: "4 hours" }
        ],
        outcomes: [
            "Assess AI ROI accurately",
            "Lead AI transformation initiatives",
            "Mitigate legal and reputational risks",
            "Foster an AI-first culture",
            "Build high-performing AI teams",
            "Create sustainable AI governance"
        ],
        whoIsThisFor: [
            { title: "C-Suite Executives", description: "CEOs, CTOs, and CDOs driving AI strategy" },
            { title: "Directors", description: "Leaders implementing AI in their departments" },
            { title: "Consultants", description: "Advisors helping clients with AI adoption" },
            { title: "Board Members", description: "Governance leaders overseeing AI initiatives" },
        ]
    }
};

export default function CourseDetail() {
    const params = useParams();
    const slug = typeof params?.slug === 'string' ? params.slug : '';
    const course = courseData[slug];
    const [expandedWeek, setExpandedWeek] = useState<number | null>(0);

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-800">Course Not Found</h1>
                    <Link href="/courses" className="text-primary hover:underline mt-4 block">Back to Courses</Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white overflow-hidden">
            {/* Hero Section */}
            <section className={`relative pt-32 pb-20 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden`}>
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className={`absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-r ${course.gradient} opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`} />
                    <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-r ${course.gradient} opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2`} />
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    {/* Breadcrumb */}
                    <Link href="/courses" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" /> Back to Courses
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Left Content */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${course.gradient} text-white font-medium text-sm mb-6`}>
                                    <GraduationCap className="w-4 h-4" />
                                    {course.level} Course
                                </span>

                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                                    {course.title}
                                </h1>

                                <p className="text-xl text-slate-300 mb-6">
                                    {course.subtitle}
                                </p>

                                <p className="text-slate-400 mb-8 leading-relaxed">
                                    {course.longDescription}
                                </p>

                                {/* Stats Row */}
                                <div className="flex flex-wrap gap-6">
                                    <div className="flex items-center gap-2 text-white">
                                        <Star className="w-5 h-5 text-amber-400 fill-current" />
                                        <span className="font-bold">{course.rating}</span>
                                        <span className="text-slate-400">rating</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white">
                                        <Users className="w-5 h-5 text-slate-400" />
                                        <span className="font-bold">{course.students}</span>
                                        <span className="text-slate-400">students</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white">
                                        <Clock className="w-5 h-5 text-slate-400" />
                                        <span className="font-bold">{course.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white">
                                        <BookOpen className="w-5 h-5 text-slate-400" />
                                        <span className="font-bold">{course.lessons}</span>
                                        <span className="text-slate-400">lessons</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right - Enrollment Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative"
                        >
                            <div className="bg-white rounded-3xl p-8 shadow-2xl sticky top-24">
                                {/* Price */}
                                <div className="text-center mb-6">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Calendar className={`w-5 h-5 text-transparent bg-clip-text bg-gradient-to-r ${course.gradient}`} style={{ color: 'rgb(59 130 246)' }} />
                                        <span className="text-slate-600 font-medium">Open for Enrollment</span>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full py-4 bg-gradient-to-r ${course.gradient} text-white rounded-xl font-bold text-lg shadow-lg mb-4`}
                                >
                                    Enroll Now
                                </motion.button>

                                <p className="text-center text-sm text-slate-500 mb-6 flex items-center justify-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    30-day money-back guarantee
                                </p>

                                {/* Features */}
                                <div className="border-t border-slate-100 pt-6">
                                    <p className="text-sm font-semibold text-slate-900 mb-4">This course includes:</p>
                                    <ul className="space-y-3">
                                        {course.features.map((feature: any, i: number) => (
                                            <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                                <feature.icon className={`w-5 h-5`} style={{ color: 'rgb(59 130 246)' }} />
                                                {feature.text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom Wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0 100V60C240 20 480 0 720 0C960 0 1200 20 1440 60V100H0Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* What You'll Learn */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <span className={`text-transparent bg-clip-text bg-gradient-to-r ${course.gradient} font-medium tracking-wider text-sm uppercase mb-3 block`}>
                            Learning Outcomes
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                            What You'll Learn
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {course.outcomes.map((outcome: string, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                            >
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${course.gradient} flex items-center justify-center flex-shrink-0`}>
                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-slate-700 font-medium leading-relaxed">{outcome}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Course Curriculum */}
            <section className="py-20 px-6 bg-slate-50">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <span className={`text-transparent bg-clip-text bg-gradient-to-r ${course.gradient} font-medium tracking-wider text-sm uppercase mb-3 block`}>
                            Curriculum
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                            Course Content
                        </h2>
                    </motion.div>

                    <div className="space-y-4">
                        {course.syllabus.map((module: any, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                            >
                                <button
                                    onClick={() => setExpandedWeek(expandedWeek === i ? null : i)}
                                    className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${course.gradient} flex items-center justify-center text-white font-bold`}>
                                            {String(i + 1).padStart(2, '0')}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-mono text-slate-400">{module.week}</span>
                                                <span className="text-xs text-slate-400">•</span>
                                                <span className="text-xs text-slate-400">{module.duration}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900">{module.title}</h3>
                                        </div>
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedWeek === i ? 'rotate-180' : ''}`} />
                                </button>

                                {expandedWeek === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        className="px-6 pb-6"
                                    >
                                        <div className="pl-16">
                                            <p className="text-slate-600 mb-4">{module.description}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {module.topics.map((topic: string, t: number) => (
                                                    <span key={t} className="text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                                                        {topic}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who Is This For */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <span className={`text-transparent bg-clip-text bg-gradient-to-r ${course.gradient} font-medium tracking-wider text-sm uppercase mb-3 block`}>
                            Target Audience
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                            Who Is This Course For?
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {course.whoIsThisFor.map((audience: any, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-shadow"
                            >
                                <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-r ${course.gradient} flex items-center justify-center mb-4`}>
                                    <Target className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">{audience.title}</h3>
                                <p className="text-sm text-slate-500">{audience.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={`py-20 px-6 bg-gradient-to-r ${course.gradient}`}>
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Ready to Start Learning?
                        </h2>
                        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                            Join {course.students} students who have already transformed their careers with this course.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-8 py-4 bg-white text-slate-900 rounded-full font-semibold shadow-xl hover:bg-slate-50 transition-colors flex items-center gap-2"
                            >
                                Enroll Now <ArrowRight className="w-5 h-5" />
                            </motion.button>
                            <Link href="/contact">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 bg-white/10 text-white rounded-full font-semibold border border-white/30 hover:bg-white/20 transition-colors"
                                >
                                    Talk to Advisor
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
