# 🚗 FlipkaAI - AI-Powered Vehicle Flipping Platform

<p align="center">
  <strong>Sri Lanka's First AI-Powered Vehicle Resale Intelligence Platform</strong>
</p>

---

## 🌟 Overview

**FlipkaAI** is a revolutionary SaaS platform designed specifically for the Sri Lankan vehicle market. We combine real-time Facebook Marketplace data scraping with advanced Artificial Intelligence to help car resellers, investors, and buyers make data-driven decisions. Our platform identifies undervalued vehicles, predicts market trends, and provides comprehensive analysis in **English, Sinhala (සිංහල), and Tamil (தமிழ்)**.

---

## 🤖 AI Technologies Integrated

### 1. **Gemini 3 Pro - Advanced Reasoning Engine**

Our core AI analysis is powered by **Google Gemini 3 Pro Preview**, the latest generation of Google's advanced AI model with enhanced reasoning capabilities.

**Key Features:**
- **Deep Market Analysis**: Gemini 3 Pro analyzes each vehicle listing with multi-layered reasoning, understanding context, pricing anomalies, and market positioning
- **Thinking Level Configuration**: We utilize Gemini's `thinkingLevel` parameter to balance speed and analysis depth
- **Multi-Language Intelligence**: Native understanding and response generation in English, Sinhala, and Tamil
- **Price Interpretation AI**: Automatically corrects common Sri Lankan pricing patterns:
  - **Lakhs Notation Detection**: Recognizes "128" as "128 Lakhs" (LKR 12,800,000)
  - **USD Symbol Correction**: Identifies fake USD listings (e.g., "$75" = 75 Lakhs LKR)
  - **Hand Price Detection**: Flags lease transfer deals and estimates true vehicle value

```
AI Model: gemini-3-pro-preview
Max Output Tokens: 8,192
Thinking Level: Configurable (low/high)
```

---

### 2. **Intelligent Vehicle Scoring System (Flip Rating)**

Our proprietary **Flip Rating Algorithm** (1-10 scale) evaluates every vehicle listing:

| Rating | Interpretation | Market Position |
|--------|----------------|-----------------|
| 9-10 | 🟢 **Steal Deal** | 15%+ below market value |
| 7-8 | 🟡 **Good Opportunity** | 8-14% below market |
| 5-6 | 🟠 **Fair Price** | Within 7% of market |
| 3-4 | 🔴 **Lease Transfer Risk** | Hand price / hidden costs |
| 1-2 | ⛔ **Overpriced** | Above market value |

The AI considers:
- Current market average prices
- Vehicle age and depreciation curve
- Listing price vs. market percentile
- Historical price trends
- Location-based pricing variations
- Sri Lankan economic indicators

---

### 3. **Real-Time Market Scraping with Apify Integration**

We utilize **Apify's Facebook Marketplace Actor** for real-time data acquisition:

- **Targeted Province Scraping**: Search across all 9 Sri Lankan provinces with Facebook Location IDs
- **Category-Specific Filtering**: Vehicles category (ID: 546583916084032)
- **Fresh Listings Only**: Default filter for listings posted within 7 days
- **High-Volume Processing**: Capable of scanning 500+ listings per query

**Data Extracted:**
- Vehicle title & description
- Listed price (with normalization)
- Seller information
- Location (city/province)
- Listing images
- Post timestamp

---

### 4. **Smart Filtering Pipeline**

Our multi-stage filtering system processes raw listings through intelligent algorithms:

#### Stage 1: Rental Detection AI
Automatically excludes rental listings using:
- Keyword analysis (rent, hire, per day, මාසිකව, கிராயம்)
- Price anomaly detection (suspiciously low prices)
- Pattern recognition in titles

#### Stage 2: Percentile-Based Selection
- **Bottom 20%**: Hand price / lease transfer deals
- **Middle 30%**: Market-priced vehicles
- **Top 50%**: Premium / full-price listings

#### Stage 3: Balance Ratio Algorithm
Final output maintains **20% hand prices + 80% full prices** to give users a balanced view of the market.

---

### 5. **AI Price Prediction & Market Trend Analysis**

Each analyzed vehicle includes:

#### Historical Price Data (2018-2024)
- Year-over-year price tracking
- Economic crisis impact analysis (2022 spike modeled)
- Depreciation curve calculation

#### Future Price Predictions (2025-2027)
- Machine learning-based projections
- Market trend indicators: **Stable | Appreciating | Depreciating**
- Investment recommendation based on predicted value

**Example Output:**
```json
{
  "priceHistory": [
    {"year": 2022, "price": 10500000},
    {"year": 2023, "price": 9800000},
    {"year": 2024, "price": 9200000}
  ],
  "pricePrediction": [
    {"year": 2025, "price": 8800000},
    {"year": 2026, "price": 8500000},
    {"year": 2027, "price": 8200000}
  ],
  "marketTrend": "Depreciating"
}
```

---

### 6. **AI-Powered Buying Guide Generation**

For every vehicle, FlipkaAI generates a comprehensive buying guide:

| Section | AI-Generated Content |
|---------|----------------------|
| **Red Flags** | Potential issues identified from listing |
| **Potential** | Investment opportunities and upsides |
| **Expert Tips** | Negotiation strategies |
| **Documents Checklist** | Required paperwork for Sri Lankan vehicle transfers |
| **Common Issues** | Model-specific mechanical problems with estimated repair costs |

---

### 7. **Natural Language Processing (NLP) for Multi-Language Support**

FlipkaAI breaks language barriers in the Sri Lankan vehicle market:

| Language | Code | AI Response |
|----------|------|-------------|
| English | `en` | Full analysis in English |
| Sinhala | `si` | සම්පූර්ණ විශ්ලේෂණය සිංහලෙන් |
| Tamil | `ta` | முழு பகுப்பாய்வு தமிழில் |

The AI translates:
- Vehicle recommendations
- Red flags and potential benefits
- Buying guides and expert tips
- Profit estimations with local currency formatting

---

### 8. **Estimated Profit Calculator**

Real-time profit potential calculation:

```
Estimated Profit = Market Midpoint Price - Listed Price

Example:
- Listed: LKR 8,500,000
- Market Range: LKR 9,800,000 - LKR 10,400,000
- Market Midpoint: LKR 10,100,000
- Estimated Profit: LKR 1,600,000 (15.8% margin)
```

For hand prices, the AI calculates:
```
Hand Price: LKR 1,100,000
+ Lease Remaining: ~LKR 8,000,000
= Total Investment: ~LKR 9,100,000
Market Value: LKR 10,500,000
Potential Profit: LKR 1,400,000
```

---

### 9. **AI Advisor - Purpose-Based Recommendations**

The **Flipka AI Advisor** understands natural language queries:

**User Input:**
> "I need a reliable family car for 5 people with good fuel economy for long trips"

**AI Response:**
- Recommends: Toyota Prius 3rd Gen, Honda Vezel
- Explains: Fuel economy ratings, reliability scores, best use cases
- Shows: Price trends and future predictions

---

### 10. **Workflow Automation with n8n Integration**

Our backend leverages **n8n** for orchestrated AI workflows:

```
Trigger → Apify Scrape → Filter → Gemini Analysis → Response Formatting
```

**Benefits:**
- Modular workflow design
- Error handling and retry logic
- Rate limit management for Gemini 3 Pro (5 RPM)
- Memory-efficient processing for large datasets

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FlipkaAI Platform                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │
│  │   Next.js    │───▶│  API Routes  │───▶│   Apify Actor        │  │
│  │   Frontend   │    │  /api/*      │    │   (FB Marketplace)   │  │
│  └──────────────┘    └──────────────┘    └──────────────────────┘  │
│         │                   │                       │               │
│         │                   ▼                       │               │
│         │            ┌──────────────┐               │               │
│         │            │   Filter     │◄──────────────┘               │
│         │            │   Pipeline   │                               │
│         │            └──────────────┘                               │
│         │                   │                                       │
│         │                   ▼                                       │
│         │            ┌──────────────────┐                          │
│         │            │  Gemini 3 Pro    │                          │
│         │            │  AI Analysis     │                          │
│         │            └──────────────────┘                          │
│         │                   │                                       │
│         ▼                   ▼                                       │
│  ┌──────────────────────────────────────┐                          │
│  │          MySQL Database              │                          │
│  │  (Users, Saved Vehicles, Tokens)     │                          │
│  └──────────────────────────────────────┘                          │
│                                                                      │
│  ┌──────────────────────────────────────┐                          │
│  │       Dodo Payments Integration      │                          │
│  │         (Token Purchases)            │                          │
│  └──────────────────────────────────────┘                          │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 💰 Token-Based AI Analysis Economy

FlipkaAI operates on a token-based system:

| Action | Token Cost |
|--------|------------|
| Scan 100 listings | 100 Tokens |
| Analyze Top 10 | Included |
| Analyze Top 20 | 200 Tokens |
| Analyze Top 50 | 500 Tokens |
| Custom Config | Variable |

**Token Packages:**
- Starter Pack: 100 Tokens → $5.00
- Pro Flipper: 500 Tokens → $20.00 (Most Popular)
- Enterprise: 1,500 Tokens → $50.00

---

## 🔒 Security & Payments

- **Authentication**: Secure user registration with password hashing
- **Payment Gateway**: Dodo Payments integration for international transactions
- **Data Protection**: MySQL database with connection pooling
- **API Security**: Environment-based API key management

---

## 📱 User Interface Features

- **Responsive Design**: Optimized for mobile-first experience
- **Dark/Light Mode**: User preference with branded colors
- **Price Charts**: SVG-based visualization of price trends
- **Splash Screen**: Premium brand experience on app launch
- **AI Loading Animation**: Real-time progress indicators during analysis

---

## 🎯 Target Market

| Segment | Use Case |
|---------|----------|
| **Car Resellers** | Find underpriced vehicles for quick flips |
| **First-Time Buyers** | Get AI guidance on best value purchases |
| **Investors** | Track market trends and predict appreciation |
| **Uber/PickMe Drivers** | Find fuel-efficient vehicles at best prices |
| **Finance Professionals** | Identify lease takeover opportunities |

---

## 🌐 Supported Regions

| Province | Location ID | Status |
|----------|-------------|--------|
| All of Sri Lanka | 112398955437729 | ✅ Active |
| Western Province | 108602292505393 | ✅ Active |
| Central Province | 112398955437729 | ✅ Active |
| Southern Province | 108021732551696 | ✅ Active |
| Northern Province | 104077756295393 | ✅ Active |
| Eastern Province | 106168602746942 | ✅ Active |
| North Western | 108407892517483 | ✅ Active |
| North Central | 107723089250439 | ✅ Active |
| Uva Province | 108214159198733 | ✅ Active |
| Sabaragamuwa | 104053949631625 | ✅ Active |

---

## 📊 AI Analysis Output Sample

```json
{
  "vehicleTitle": "Toyota Prius 2017 3rd Gen",
  "price": "LKR 6,500,000",
  "location": "Colombo, Western Province",
  "flipRating": 8,
  "recommendation": "Strong Buy - 12% below market average",
  "estimatedProfit": "LKR 750,000 - LKR 950,000",
  "averageMarketPrice": "LKR 7,200,000 - LKR 7,500,000",
  "marketTrend": "Stable",
  "futurePrice": "LKR 6,800,000 (2026 Est.)",
  "reasoning": [
    "Low mileage for model year",
    "Premium 3rd generation model",
    "Located in high-demand area"
  ],
  "redFlags": [
    "Verify service history with Toyota Lanka",
    "Check hybrid battery health"
  ],
  "buyingGuide": [
    "Request hybrid battery scan report",
    "Verify import registration documents",
    "Check for accident history at RMV"
  ],
  "expertTips": [
    "Negotiate 5-8% from listed price",
    "Hybrid models have strong resale"
  ],
  "documentsChecklist": [
    "Vehicle Registration (CR)",
    "Revenue License",
    "Insurance Certificate",
    "Import Documents (if applicable)",
    "Service Records"
  ],
  "commonIssues": [
    {
      "title": "Hybrid Battery Degradation",
      "description": "Battery cells may need reconditioning after 8+ years",
      "cost": "LKR 150,000 - 300,000"
    },
    {
      "title": "Inverter Pump Failure",
      "description": "Common in high-mileage vehicles",
      "cost": "LKR 45,000 - 80,000"
    }
  ]
}
```

---

## 🔮 Platform Roadmap

| Phase | Features | Status |
|-------|----------|--------|
| **v1.0** | Core AI Analysis, Multi-Language | ✅ Live |
| **v1.1** | Price Predictions, Trend Charts | ✅ Live |
| **v1.2** | AI Advisor Natural Language | ✅ Live |
| **v1.3** | n8n Workflow Integration | ✅ Live |
| **v2.0** | Mobile App (iOS/Android) | 🚧 Planned |
| **v2.1** | WhatsApp Bot Integration | 🚧 Planned |
| **v2.2** | Dealer Dashboard | 🚧 Planned |

---

## 📞 Contact & Support

- **Platform**: FlipkaAI
- **Market**: Sri Lanka Vehicle Resale
- **Primary AI**: Google Gemini 3 Pro
- **Data Source**: Facebook Marketplace (via Apify)
- **Payment**: Dodo Payments

---

<p align="center">
  <strong>FlipkaAI - Where AI Meets Automotive Intelligence 🚗🤖</strong>
</p>

<p align="center">
  <em>Flip Smarter. Profit Faster.</em>
</p>

---

© 2026 FlipkaAI. All rights reserved.
