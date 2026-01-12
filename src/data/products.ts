export interface ProductShowcase {
    title: string;
    description: string;
    highlight: string;
    image?: string; // Optional: Path to screenshot image (e.g., "/images/products/dashboard.png")
}

export interface Product {
    slug: string;
    title: string;
    subtitle: string;
    description: string;
    longDescription: string;
    gradient: string;
    shadowColor: string;
    badge: string;
    badgeColor: string;
    features: string[];
    benefits: {
        title: string;
        description: string;
    }[];
    useCases: string[];
    techSpecs: {
        label: string;
        value: string;
    }[];
    uiShowcase: ProductShowcase[];
}

export const products: Product[] = [
    {
        slug: "smart-clinic-manager",
        title: "Smart Clinic Manager",
        subtitle: "Healthcare Management",
        description: "Complete appointment scheduling and institute management system for modern healthcare facilities.",
        longDescription: "Smart Clinic Manager is a comprehensive healthcare management platform designed to streamline operations for clinics, hospitals, and medical practices. Built with AI at its core, it automates scheduling, manages patient records securely, and provides actionable insights through advanced analytics.",
        gradient: "from-teal-500 via-emerald-500 to-cyan-500",
        shadowColor: "shadow-teal-500/25",
        badge: "Popular",
        badgeColor: "bg-amber-400 text-amber-900",
        features: ["Appointment Scheduling", "Patient Records", "Billing Integration", "Analytics Dashboard"],
        benefits: [
            {
                title: "Reduce No-Shows by 60%",
                description: "AI-powered reminder system with smart scheduling reduces missed appointments significantly."
            },
            {
                title: "Paperless Operations",
                description: "Digitize all patient records with secure cloud storage and instant retrieval."
            },
            {
                title: "Revenue Optimization",
                description: "Integrated billing and insurance claim processing accelerates payments."
            },
            {
                title: "Data-Driven Decisions",
                description: "Comprehensive analytics dashboard helps identify trends and optimize resources."
            }
        ],
        useCases: [
            "Private medical practices",
            "Multi-specialty clinics",
            "Dental offices",
            "Physical therapy centers",
            "Mental health practices"
        ],
        techSpecs: [
            { label: "Deployment", value: "Cloud / On-Premise" },
            { label: "Compliance", value: "HIPAA Compliant" },
            { label: "Integrations", value: "HL7, FHIR, REST API" },
            { label: "Support", value: "24/7 Priority Support" }
        ],
        uiShowcase: [
            {
                title: "Intuitive Dashboard",
                description: "Get a complete overview of your clinic's performance at a glance. Track appointments, patient flow, and revenue metrics in real-time.",
                highlight: "Real-time metrics and KPIs"
            },
            {
                title: "Smart Scheduling",
                description: "AI-powered scheduling that automatically optimizes appointment slots, reduces gaps, and sends intelligent reminders to patients.",
                highlight: "60% fewer no-shows"
            },
            {
                title: "Patient Records",
                description: "Secure, HIPAA-compliant digital records with instant search, detailed history tracking, and seamless document management.",
                highlight: "Paperless operations"
            },
            {
                title: "Analytics & Reports",
                description: "Comprehensive reporting suite with customizable dashboards, trend analysis, and actionable insights for better decision-making.",
                highlight: "Data-driven decisions"
            }
        ]
    },
    {
        slug: "ai-analytics-suite",
        title: "AI Analytics Suite",
        subtitle: "Enterprise Intelligence",
        description: "Real-time insights and predictive modeling for enterprise data with advanced machine learning capabilities.",
        longDescription: "The AI Analytics Suite transforms raw enterprise data into actionable intelligence. Leveraging cutting-edge machine learning algorithms, it provides real-time dashboards, predictive forecasting, and anomaly detection to help businesses make smarter decisions faster.",
        gradient: "from-blue-600 via-indigo-600 to-violet-600",
        shadowColor: "shadow-blue-500/25",
        badge: "Enterprise",
        badgeColor: "bg-blue-100 text-blue-700",
        features: ["Real-time Analytics", "Predictive Models", "Custom Reports", "API Access"],
        benefits: [
            {
                title: "10x Faster Insights",
                description: "Process millions of data points in seconds with our optimized ML pipeline."
            },
            {
                title: "Predictive Accuracy",
                description: "Industry-leading forecasting models with up to 95% accuracy on business metrics."
            },
            {
                title: "Self-Service BI",
                description: "Empower non-technical users to create custom reports and visualizations."
            },
            {
                title: "Seamless Integration",
                description: "Connect to 100+ data sources including Salesforce, SAP, and databases."
            }
        ],
        useCases: [
            "Sales forecasting",
            "Supply chain optimization",
            "Customer churn prediction",
            "Financial risk analysis",
            "Marketing attribution"
        ],
        techSpecs: [
            { label: "Processing", value: "Real-time & Batch" },
            { label: "Security", value: "SOC 2 Type II" },
            { label: "Scalability", value: "Unlimited Users" },
            { label: "Data Sources", value: "100+ Integrations" }
        ],
        uiShowcase: [
            {
                title: "Live Dashboard",
                description: "Monitor all your key metrics in real-time with customizable widgets and instant alerts for anomalies.",
                highlight: "Real-time updates"
            },
            {
                title: "Predictive Models",
                description: "Build and deploy ML models without code. Our AutoML engine handles feature engineering, training, and optimization.",
                highlight: "95% forecast accuracy"
            },
            {
                title: "Data Connectors",
                description: "Connect to 100+ data sources including databases, SaaS apps, and streaming platforms with one-click integrations.",
                highlight: "Universal connectivity"
            },
            {
                title: "Custom Reports",
                description: "Create stunning visualizations and scheduled reports that automatically deliver insights to stakeholders.",
                highlight: "Automated reporting"
            }
        ]
    },
    {
        slug: "vision-api",
        title: "Vision API",
        subtitle: "Developer Tools",
        description: "Advanced image recognition and processing API with industry-leading accuracy for seamless developer integration.",
        longDescription: "Our Vision API provides developers with state-of-the-art computer vision capabilities through a simple REST interface. From object detection and facial recognition to OCR and image classification, power your applications with AI that sees and understands.",
        gradient: "from-indigo-600 via-purple-600 to-pink-600",
        shadowColor: "shadow-indigo-500/25",
        badge: "New",
        badgeColor: "bg-green-100 text-green-700",
        features: ["Object Detection", "Face Recognition", "OCR Processing", "99.9% Uptime SLA"],
        benefits: [
            {
                title: "Sub-100ms Latency",
                description: "Lightning-fast inference powered by globally distributed edge servers."
            },
            {
                title: "99.2% Accuracy",
                description: "Best-in-class accuracy across all major computer vision benchmarks."
            },
            {
                title: "Easy Integration",
                description: "Simple REST API with SDKs for Python, Node.js, Go, and more."
            },
            {
                title: "Pay-Per-Use",
                description: "Only pay for what you use with transparent, predictable pricing."
            }
        ],
        useCases: [
            "Identity verification",
            "Document processing",
            "Content moderation",
            "Retail analytics",
            "Medical imaging"
        ],
        techSpecs: [
            { label: "Latency", value: "<100ms average" },
            { label: "Formats", value: "JPEG, PNG, WebP, PDF" },
            { label: "Rate Limit", value: "10,000 req/min" },
            { label: "SDKs", value: "Python, Node, Go, Java" }
        ],
        uiShowcase: [
            {
                title: "API Console",
                description: "Test and explore all Vision API endpoints directly in your browser with our interactive playground.",
                highlight: "Try before you code"
            },
            {
                title: "Object Detection",
                description: "Identify and locate objects in images with bounding boxes, confidence scores, and hierarchical labels.",
                highlight: "99.2% accuracy"
            },
            {
                title: "Face Analysis",
                description: "Detect faces with landmarks, emotions, age estimation, and similarity matching for identity verification.",
                highlight: "Enterprise-grade"
            },
            {
                title: "OCR Engine",
                description: "Extract text from images and documents with support for 100+ languages and handwriting recognition.",
                highlight: "Multi-language OCR"
            }
        ]
    },
    {
        slug: "content-engine",
        title: "Content Engine",
        subtitle: "Marketing Automation",
        description: "Automated content generation platform powered by cutting-edge generative AI for marketing teams.",
        longDescription: "Content Engine revolutionizes marketing by automating content creation at scale. Using advanced generative AI, it produces high-quality blog posts, social media content, email campaigns, and more—all while maintaining your brand voice and style guidelines.",
        gradient: "from-pink-500 via-rose-500 to-orange-500",
        shadowColor: "shadow-pink-500/25",
        badge: "AI Powered",
        badgeColor: "bg-purple-100 text-purple-700",
        features: ["Blog Generation", "Social Media Posts", "Email Campaigns", "Multi-language"],
        benefits: [
            {
                title: "10x Content Output",
                description: "Generate months of content in hours while maintaining consistent quality."
            },
            {
                title: "Brand Consistency",
                description: "AI learns your brand voice to create on-brand content every time."
            },
            {
                title: "SEO Optimized",
                description: "Built-in SEO analysis ensures your content ranks higher in search."
            },
            {
                title: "Multi-Channel",
                description: "Create content for blogs, social, email, and ads from a single brief."
            }
        ],
        useCases: [
            "Content marketing teams",
            "E-commerce product descriptions",
            "Social media agencies",
            "Email marketing automation",
            "Multilingual campaigns"
        ],
        techSpecs: [
            { label: "Languages", value: "50+ Supported" },
            { label: "Tone Styles", value: "Customizable" },
            { label: "Plagiarism", value: "Built-in Check" },
            { label: "Export", value: "MD, HTML, DOCX" }
        ],
        uiShowcase: [
            {
                title: "Content Studio",
                description: "A beautiful writing environment with AI assistance, real-time suggestions, and seamless collaboration features.",
                highlight: "Write 10x faster"
            },
            {
                title: "Brand Voice",
                description: "Train the AI on your brand guidelines, tone, and style to generate perfectly on-brand content every time.",
                highlight: "Consistent messaging"
            },
            {
                title: "Multi-Channel",
                description: "Generate content for blogs, social media, emails, and ads from a single brief with format-specific optimization.",
                highlight: "One brief, all channels"
            },
            {
                title: "SEO Optimizer",
                description: "Built-in SEO analysis with keyword suggestions, readability scores, and competitor benchmarking.",
                highlight: "Rank higher"
            }
        ]
    }
];

export function getProductBySlug(slug: string): Product | undefined {
    return products.find(p => p.slug === slug);
}

export function getAllProductSlugs(): string[] {
    return products.map(p => p.slug);
}
