# Fact Analyzer Platform

Fact Analyzer Platform is a web application designed to combat misinformation by providing real-time article analysis, claim verification, and source ranking. Leveraging Perplexity’s Sonar Pro API, it segments articles into claims, verifies them against web sources, and ranks sources using authenticity and tonality metrics. The platform supports user authentication, personalized content feeds, public report sharing, and a collaborative networking section with image integration.

## Features

- **User Management**: Secure email/password signup and login with Firebase Authentication, including email verification and optional profile personalization (country, interests).
- **Content Management**: Fetches articles via NewsAPI, stores them in MongoDB with 3-day expiration, and personalizes feeds based on user interests.
- **Fact Analysis**: Uses Perplexity’s Sonar Pro API for claim segmentation, real-time verification, and source ranking with metrics like verbatim match, omission rate, and tonality.
- **Source Intelligence**: Ranks sources by tier (e.g., Tier 1 for official reports), with authenticity and tonality scores, and provides clickable excerpts with highlighted text navigation.
- **Reporting & Visualization**: Generates detailed fact-check reports with KPI cards (True/False/Misleading/Unverifiable) and interactive metrics, shareable publicly or privately.
- **Collaborative Networking**: Features a feed with Sonar Pro-extracted images, enabling users to share reports and engage with similar-interest communities.

## Tech Stack

- **Frontend**: React.js with Tailwind CSS for responsive UI, including dark/light mode and dynamic visualizations.
- **Backend**: FastAPI for high-performance API endpoints, handling requests for article, user, and report management.
- **Authentication**: Firebase Authentication for secure signup, login, and email verification.
- **Database**: MongoDB for scalable storage of articles, user profiles, and reports, with aggregation pipelines for report comparison.
- **APIs**: NewsAPI for article metadata, Perplexity Sonar Pro for claim verification, source ranking, and image extraction.

## Installation

### Prerequisites
- Python 3.11
- MongoDB
- Firebase project with Authentication and Storage enabled
- NewsAPI key
- Perplexity Sonar Pro API key

### Setup

1. **Clone the Repository**
   ```bash
   git clone [https://github.com/your-username/fact-analyzer-platform](https://github.com/shiyamk-ds/Fact-Analyzer-Platform/).git
   cd fact-analyzer-platform
   ```

2. **Backend Setup**
   - Navigate to the backend directory:
     ```bash
     cd fact-check-ai_backend
     ```
   - Install dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Run the FastAPI server:
     ```bash
     uvicorn main:app --reload
     ```

3. **Frontend Setup**
   - Navigate to the frontend directory:
     ```bash
     cd fact-check-ai_frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the React development server:
     ```bash
     npm start
     ```

4. **MongoDB Setup**
   - Ensure MongoDB is running locally or use a cloud provider (e.g., MongoDB Community Server).

## Usage

1. **Signup/Login**: Register with email/password, verify email via Firebase, and optionally set a username, country, and up to three topics of interest for personalized feeds.
2. **Browse Articles**: View a list of articles fetched from NewsAPI, filtered by selected interests.
3. **Analyze Articles**: Click “Analyze” to trigger Sonar Pro-based claim segmentation and verification. View reports with KPI cards and source rankings.
4. **View Reports**: Access detailed reports with claim breakdowns, authenticity/tonality metrics, and clickable source excerpts that highlight relevant text in original articles.
5. **Share Reports**: Toggle report visibility to public/private and share via the collaborative feed, which includes Sonar Pro-extracted images.
6. **Engage in Feed**: Explore public reports, engage with posts, and view images from similar-interest users.

## Project Structure

```plaintext
fact-analyzer-platform/
├── backend/
│   ├── main.py               # FastAPI application entry point
│   ├── routes/              # API endpoints for user, article, and report management
│   ├── services/            # Logic for Sonar Pro, NewsAPI, and MongoDB interactions
│   ├── requirements.txt      # Python dependencies
│   └── .env                 # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/      # React component
│   │   ├── services/        # services for backend
│   │   ├── App.js           # Main React app
│   │   └── index.js         # React entry point
│   ├── public/              # Static assets
│   ├── package.json         # Node dependencies
│   └── .env                 # Frontend environment variables
└── README.md                # Project documentation
```

## Challenges Faced

- Optimized Sonar Pro API calls to balance cost and latency for large articles.
- Tuned source ranking algorithms to prioritize primary sources without overweighting secondary ones.
- Addressed cross-browser compatibility for text highlighting.
- Scaled the feed for image-heavy posts using Firebase Storage CDN and lazy-loading.

## Future Improvements

- Integrate machine learning for enhanced tonality analysis.
- Support multilingual claim verification using Sonar Pro’s capabilities.
- Add real-time collaboration for co-analyzing articles.
- Implement sentiment-based feed filtering.
- Develop a mobile app with Firebase cross-platform support.

## Acknowledgments

- Perplexity Sonar Pro for real-time claim verification and source ranking.
- NewsAPI for providing article metadata.
- Firebase for secure authentication and storage.
- MongoDB for scalable data management.
