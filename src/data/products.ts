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
    logo?: string; // Optional: Path to product logo (e.g., "/images/Logo/medflow-logo.png")
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
        slug: "medflow-ai",
        title: "MedFlow AI",
        subtitle: "AI-Powered Healthcare",
        description: "State-of-the-art AI-integrated healthcare management platform for clinics and rehabilitation centers.",
        longDescription: "MedFlow AI is a state-of-the-art, AI-integrated healthcare management platform designed for modern clinics and rehabilitation centers. Our platform seamlessly combines intelligent automation, predictive analytics, and modern communication tools to deliver an unparalleled healthcare management experience. Built with enterprise-grade technology and powered by advanced AI systems including GPT-4 and Gemini integration.",
        gradient: "from-emerald-600 via-teal-500 to-cyan-500",
        shadowColor: "shadow-emerald-500/25",
        badge: "AI Powered",
        badgeColor: "bg-purple-100 text-purple-700",
        logo: "/images/Logo/medflow-ai-logo.png",
        features: ["AI Content Generation", "Smart Scheduling", "WhatsApp Automation", "Predictive Analytics"],
        benefits: [
            {
                title: "Reduce No-Shows by 40%",
                description: "AI-powered WhatsApp reminders with Twilio integration dramatically reduce missed appointments."
            },
            {
                title: "Save 15+ Hours Weekly",
                description: "Intelligent automation handles scheduling, reminders, and patient communication automatically."
            },
            {
                title: "3x Social Engagement",
                description: "AI-generated marketing content with GPT-4 creates professional captions and imagery instantly."
            },
            {
                title: "Predictive Insights",
                description: "ML-powered forecasting predicts patient volumes, revenue, and identifies no-show risks."
            }
        ],
        useCases: [
            "Rehabilitation consultants",
            "Ayurvedic practitioners",
            "Physiotherapists",
            "Sports medicine specialists",
            "Orthopedic surgeons"
        ],
        techSpecs: [
            { label: "AI Engine", value: "GPT-4, Gemini, n8n" },
            { label: "Communication", value: "Twilio WhatsApp API" },
            { label: "Database", value: "PostgreSQL with Neon" },
            { label: "Deployment", value: "Docker, Vercel, Cloud" }
        ],
        uiShowcase: [
            {
                title: "Predictive Dashboard",
                description: "AI-powered dashboard with real-time analytics, patient flow predictions, and revenue forecasting. Tracks appointments, satisfaction scores, and resource optimization.",
                highlight: "ML-powered predictions"
            },
            {
                title: "AI Content Generator",
                description: "Sophisticated AI-powered marketing engine using GPT-4 and DALL-E. Generate professional social media captions, hashtags, and promotional images in seconds.",
                highlight: "GPT-4 & DALL-E powered"
            },
            {
                title: "Smart Scheduling",
                description: "AI-driven scheduling with conflict detection, doctor matching, and predictive wait times. Features 30-minute slot management and auto-status transitions.",
                highlight: "Intelligent optimization"
            },
            {
                title: "WhatsApp Automation",
                description: "Integrated Twilio WhatsApp Business API for smart patient communication. AI-generated templates, bulk messaging, dynamic personalization, and delivery tracking.",
                highlight: "99.5% delivery rate"
            }
        ]
    },
    {
        slug: "flipka-ai",
        title: "Flipka AI",
        subtitle: "Vehicle Intelligence Platform",
        description: "AI-powered vehicle flipping platform with real-time marketplace analysis and profit predictions.",
        longDescription: "Flipka AI is a revolutionary SaaS platform that combines real-time Facebook Marketplace data scraping with advanced AI to help car resellers, investors, and buyers make data-driven decisions. Powered by Google Gemini 3 Pro, it identifies undervalued vehicles, predicts market trends, and provides comprehensive analysis in English, Sinhala, and Tamil.",
        gradient: "from-blue-600 via-blue-500 to-indigo-500",
        shadowColor: "shadow-blue-500/25",
        badge: "New",
        badgeColor: "bg-green-100 text-green-700",
        logo: "/images/Logo/logo.png",
        features: ["Gemini 3 Pro Analysis", "Flip Rating System", "Price Predictions", "Multi-Language AI"],
        benefits: [
            {
                title: "Identify Steal Deals",
                description: "AI-powered Flip Rating (1-10) instantly identifies vehicles 15%+ below market value."
            },
            {
                title: "Predict Future Value",
                description: "ML-based price predictions for 2025-2027 with market trend indicators (Stable/Appreciating/Depreciating)."
            },
            {
                title: "Multi-Language Support",
                description: "Complete analysis in English, Sinhala (සිංහල), and Tamil (தமிழ்) for the Sri Lankan market."
            },
            {
                title: "Smart Price Detection",
                description: "AI corrects Lakhs notation, fake USD listings, and identifies hand price/lease transfer deals."
            }
        ],
        useCases: [
            "Car resellers & flippers",
            "First-time vehicle buyers",
            "Automotive investors",
            "Uber/PickMe drivers",
            "Finance professionals"
        ],
        techSpecs: [
            { label: "AI Engine", value: "Gemini 3 Pro Preview" },
            { label: "Data Source", value: "Apify FB Marketplace" },
            { label: "Languages", value: "EN, SI, TA" },
            { label: "Payments", value: "Dodo Payments" }
        ],
        uiShowcase: [
            {
                title: "AI Market Scanner",
                description: "Real-time Facebook Marketplace scraping across all 9 Sri Lankan provinces. Filter by vehicle type, price range, and listing freshness with Apify integration.",
                highlight: "500+ listings per scan"
            },
            {
                title: "Flip Rating Dashboard",
                description: "Proprietary 1-10 scoring system evaluates every vehicle. Considers market averages, depreciation curves, location pricing, and economic indicators.",
                highlight: "Instant profit potential"
            },
            {
                title: "Price Prediction Engine",
                description: "Historical price tracking (2018-2024) combined with ML projections (2025-2027). Includes economic crisis impact analysis and market trend indicators.",
                highlight: "3-year forecasts"
            },
            {
                title: "AI Buying Guide",
                description: "Comprehensive guides generated for every vehicle: red flags, investment potential, negotiation strategies, document checklists, and model-specific repair cost estimates.",
                highlight: "Expert-level insights"
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
        logo: "/images/Logo/content-engine-logo.png",
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
