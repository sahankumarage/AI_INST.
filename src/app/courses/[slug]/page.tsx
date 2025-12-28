"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Clock, Calendar, Users, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Data Dictionary
const courseData: Record<string, any> = {
    "ai-fundamentals-for-everyone": {
        title: "AI Fundamentals for Everyone",
        description: "Master the basics of Artificial Intelligence, from neural networks to ethical considerations. No coding experience required.",
        longDescription: "This comprehensive course bridges the gap between technical AI concepts and real-world understanding. Whether you're a business leader looking to understand the impact of AI, or an enthusiast wanting to grasp the mechanics of neural networks, this course provides a solid foundation without getting lost in complex mathematics or code.",
        duration: "4 Weeks",
        level: "Beginner",
        rating: 4.8,
        students: "1.2k+",
        syllabus: [
            {
                week: "Week 01",
                title: "Demystifying AI",
                topics: ["History of AI", "Machine Learning vs Deep Learning", "The Neural Network Analogy", "Real-world Use Cases"]
            },
            {
                week: "Week 02",
                title: "Generative AI Revolution",
                topics: ["How LLMs Work", "Prompt Engineering Basics", "Image Generation Models", "Limitations & Hallucinations"]
            },
            {
                week: "Week 03",
                title: "AI Ethics & Safety",
                topics: ["Bias in Algorithms", "Data Privacy", "The Alignment Problem", "Future of Work"]
            },
            {
                week: "Week 04",
                title: "AI Strategy & Implementation",
                topics: ["Identifying Opportunities", "No-code AI Tools", "Building an AI Roadmap", "Final Project"]
            }
        ],
        outcomes: [
            "Navigate the AI landscape with confidence",
            "Understand the mechanics of key AI models",
            "Evaluate AI tools for personal/business use",
            "Develop a framework for ethical AI decision making"
        ]
    },
    "deep-learning-specialization": {
        title: "Deep Learning Specialization",
        description: "Dive deep into the mathematics and architecture of modern neural networks. Build your own models from scratch.",
        longDescription: "An intensive engineering track designed for those who want to build the future. We go beyond the APIs and frameworks to understand the calculus and linear algebra that powers modern AI. You will build neural networks from scratch before moving to PyTorch and TensorFlow.",
        duration: "12 Weeks",
        level: "Advanced",
        rating: 4.9,
        students: "850+",
        syllabus: [
            { week: "Week 01-03", title: "Neural Networks & Deep Learning", topics: ["Logistic Regression", "Backpropagation", "Gradient Descent"] },
            { week: "Week 04-06", title: "Convolutional Neural Networks", topics: ["Edge Detection", "Padding & Strides", "ResNets", "Object Detection"] },
            { week: "Week 07-09", title: "Sequence Models", topics: ["RNNs & LSTMs", "Transformers", "Attention Mechanisms", "NLP Applications"] },
            { week: "Week 10-12", title: "Generative Models", topics: ["GANs", "Diffusion Models", "Fine-tuning LLMs", "Capstone Project"] }
        ],
        outcomes: [
            "Master the math behind Neural Networks",
            "Build and deploy models using PyTorch",
            "Understand state-of-the-art architectures",
            "Complete a production-level Portfolio Project"
        ]
    },
    "generative-ai-and-llms": {
        title: "Generative AI & LLMs",
        description: "Learn to fine-tune Large Language Models and build custom RAG pipelines for enterprise applications.",
        longDescription: "Focusing on the hottest topic in tech, this course is practical and hands-on. You will learn how to take open-source models like Llama and Mistral, fine-tune them on custom datasets, and build Retrieval-Augmented Generation (RAG) systems that don't hallucinate.",
        duration: "8 Weeks",
        level: "Intermediate",
        rating: 4.9,
        students: "2k+",
        syllabus: [
            { week: "Week 01-02", title: "LLM Foundations", topics: ["Transformer Architecture", "Tokenization", "Embeddings"] },
            { week: "Week 03-04", title: "Prompt Engineering & RAG", topics: ["Advanced Prompting", "Vector Databases", "LangChain & LlamaIndex"] },
            { week: "Week 05-06", title: "Fine-Tuning", topics: ["PEFT & LoRA", "Dataset Preparation", "Training on Consumer GPUs"] },
            { week: "Week 07-08", title: "Deployment & Agents", topics: ["Serving Models", "AutoGPT & Agents", "Evaluation Frameworks"] }
        ],
        outcomes: [
            "Build custom RAG chatbots",
            "Fine-tune LLMs for specific domains",
            "Deploy models to production",
            "Understand the modern AI stack"
        ]
    },
    "ai-strategy-for-leaders": {
        title: "AI Strategy for Leaders",
        description: "For executives and managers: how to implement AI strategies that drive business value and ROI.",
        longDescription: "AI is an executive-level priority. This course equips decision-makers with the frameworks to assess AI maturity, identify high-value use cases, and manage the organizational change required for successful AI adoption.",
        duration: "3 Weeks",
        level: "Beginner",
        rating: 4.7,
        students: "500+",
        syllabus: [
            { week: "Week 01", title: "The Executive AI Landscape", topics: ["State of AI", "Hype vs Reality", "Competitor Analysis"] },
            { week: "Week 02", title: "Strategic Implementation", topics: ["Build vs Buy", "Talent & Hiring", "Risk Management"] },
            { week: "Week 03", title: "Future-Proofing", topics: ["AI Governance", "Scalability", "Case Studies"] }
        ],
        outcomes: [
            "Assess AI ROI accurately",
            "Lead AI transformation initiatives",
            "Mitigate legal and reputational risks",
            "Foster an AI-first culture"
        ]
    }
};

export default function CourseDetail() {
    const params = useParams();
    // Safe slug handling
    const slug = typeof params?.slug === 'string' ? params.slug : '';
    const course = courseData[slug];

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
        <main className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="max-w-5xl mx-auto px-6 md:px-20">

                {/* Breadcrumb & Back */}
                <Link href="/courses" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" /> Back to Courses
                </Link>

                {/* Hero Section */}
                <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm mb-12">
                    <div className="flex flex-col md:flex-row gap-8 justify-between">
                        <div className="flex-1">
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wide mb-4">
                                {course.level}
                            </span>
                            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                                {course.title}
                            </h1>
                            <p className="text-slate-500 text-lg leading-relaxed mb-8">
                                {course.longDescription}
                            </p>

                            <div className="flex flex-wrap gap-6 text-sm text-slate-500 font-medium">
                                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    {course.duration}
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                                    <Users className="w-4 h-4 text-slate-400" />
                                    {course.students} Enrolled
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                                    {course.rating} Rating
                                </div>
                            </div>
                        </div>

                        <div className="md:w-80 flex-shrink-0">
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <div className="mb-6">
                                    <span className="block text-slate-400 text-xs font-semibold uppercase mb-1">Start Date</span>
                                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                                        <Calendar className="w-5 h-5 text-primary" />
                                        Open for Enrollment
                                    </div>
                                </div>
                                <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-primary transition-colors shadow-lg hover:shadow-primary/25">
                                    Enroll Now
                                </button>
                                <p className="text-center text-xs text-slate-400 mt-4">
                                    30-day money-back guarantee
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-12">

                        {/* Learning Outcomes */}
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">What you'll learn</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {course.outcomes.map((outcome: string, i: number) => (
                                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-100">
                                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-slate-600 font-medium text-sm">{outcome}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Syllabus */}
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Course Syllabus</h2>
                            <div className="space-y-4">
                                {course.syllabus.map((module: any, i: number) => (
                                    <div key={i} className="group border border-slate-200 rounded-2xl bg-white overflow-hidden transition-all hover:border-primary/50">
                                        <div className="p-6">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                                                    <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-500 font-mono">
                                                        {module.week}
                                                    </span>
                                                    {module.title}
                                                </h3>
                                            </div>
                                            <div className="pl-0 md:pl-14">
                                                <ul className="flex flex-wrap gap-2">
                                                    {module.topics.map((topic: string, t: number) => (
                                                        <li key={t} className="text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full">
                                                            {topic}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200">
                            <h3 className="font-bold text-slate-900 mb-4">Prerequisites</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-slate-500">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2" />
                                    {course.level === "Advanced" ? "Strong Python and Linear Algebra knowledge" : "No prior experience required"}
                                </li>
                                <li className="flex items-start gap-3 text-sm text-slate-500">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2" />
                                    Computer with internet access
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl text-white">
                            <h3 className="font-bold text-xl mb-4">Need help choosing?</h3>
                            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                                Our team can help you find the right path for your career goals.
                            </p>
                            <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold text-sm transition-colors backdrop-blur-sm">
                                Talk to Advisor
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </main>
    );
}
