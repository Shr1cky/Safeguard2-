# Parental Content Safeguard MVP

A fast content-scanning tool that lets parents evaluate books, movies, and shows against customizable safety parameters and receive a clear recommended age and reasoned breakdown before kids watch or read.

## Features

- **Quick Content Analysis**: Input book titles/ISBNs or movie/TV show titles
- **Personalized Recommendations**: Create child profiles with age and sensitivity settings
- **Detailed Safety Breakdown**: Parameter-by-parameter analysis including:
  - Violence, Language, Sexual Content, Romantic Content
  - Substance Use, Fear/Horror
  - Themes: Death, Bullying, Mental Health, Moral Ambiguity
  - Values-Sensitive Topics: LGBTQ+, Gender Identity, Religious, Political
- **Clear Verdicts**: Red/Yellow/Green safety ratings with age recommendations
- **Trust & Transparency**: Sources, confidence levels, and issue reporting

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up your OpenAI API key:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Add your API key to `.env`:
     ```
     VITE_OPENAI_API_KEY=sk-your-api-key-here
     ```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

**Note:** The app will work without an API key, but will use mock data. For real AI-powered content analysis, you need to configure the OpenAI API key.

## Project Structure

```
src/
  ├── components/       # Reusable components (Layout, etc.)
  ├── context/         # React context (ProfileContext)
  ├── pages/           # Main pages (Home, Results, Profiles)
  └── utils/           # Utility functions (contentAnalyzer)
```

## MVP Scope

**Built Now:**
- AI-powered content analysis using OpenAI GPT-4o-mini
- Title lookup (books and movies/TV shows)
- Parameter analysis and scoring
- Age recommendation algorithm
- Child profile management
- Simple, parent-friendly UI
- Fallback to mock data if API is unavailable

**Future Enhancements:**
- Real content database integration
- Cover scanning (OCR)
- Community reviews
- Video clip previews
- School-specific profiles
- Streaming service integration

## Technology Stack

- React 18
- Vite
- React Router
- Tailwind CSS
- Lucide React (icons)
- OpenAI API (GPT-4o-mini) for content analysis

## API Configuration

The app uses OpenAI's API to analyze content. The analysis includes:
- Violence, Language, Sexual Content, Romantic Content
- Substance Use, Fear/Horror levels
- Themes: Death, Bullying, Mental Health, Moral Ambiguity
- Values-Sensitive Topics: LGBTQ+, Gender Identity, Religious, Political

The API prompt is designed to be objective and factual, providing detailed parameter scoring and age recommendations based on the content analysis.

## License

MIT
