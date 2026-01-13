import { analyzeContentWithAI } from './apiService.js'

// Mock content database - fallback when API is not available
const CONTENT_DATABASE = {
  'harry potter': {
    title: 'Harry Potter and the Sorcerer\'s Stone',
    type: 'book',
    parameters: {
      violence: 2, // moderate
      language: 0, // clean
      sexualContent: 0, // none
      romanticContent: 1, // light
      substanceUse: 0, // none
      fearHorror: 2, // moderate tension
      themes: {
        death: true,
        bullying: true,
        mentalHealth: false,
        moralAmbiguity: false,
      },
      valuesSensitive: {
        lgbtq: false,
        genderIdentity: false,
        religious: false,
        political: false,
      },
    },
    notes: 'Magical adventure with dark themes, death of parents, and mild violence.',
  },
  'frozen': {
    title: 'Frozen',
    type: 'movie',
    parameters: {
      violence: 1, // mild
      language: 0, // clean
      sexualContent: 0, // none
      romanticContent: 1, // light
      substanceUse: 0, // none
      fearHorror: 1, // mild tension
      themes: {
        death: true,
        bullying: false,
        mentalHealth: false,
        moralAmbiguity: false,
      },
      valuesSensitive: {
        lgbtq: false,
        genderIdentity: false,
        religious: false,
        political: false,
      },
    },
    notes: 'Family-friendly animated film with themes of love and sacrifice.',
  },
  'stranger things': {
    title: 'Stranger Things',
    type: 'movie',
    parameters: {
      violence: 3, // graphic
      language: 2, // frequent
      sexualContent: 0, // none
      romanticContent: 1, // light
      substanceUse: 1, // casual
      fearHorror: 3, // intense
      themes: {
        death: true,
        bullying: true,
        mentalHealth: true,
        moralAmbiguity: true,
      },
      valuesSensitive: {
        lgbtq: false,
        genderIdentity: false,
        religious: false,
        political: false,
      },
    },
    notes: 'Sci-fi horror series with intense violence, horror, and mature themes.',
  },
}

// Parameter labels
const PARAMETER_LABELS = {
  violence: { 0: 'None', 1: 'Mild', 2: 'Moderate', 3: 'Graphic' },
  language: { 0: 'Clean', 1: 'Mild', 2: 'Frequent', 3: 'Explicit' },
  sexualContent: { 0: 'None', 1: 'Implied', 2: 'Explicit' },
  romanticContent: { 0: 'None', 1: 'Light', 2: 'Central Theme' },
  substanceUse: { 0: 'None', 1: 'Casual', 2: 'Frequent' },
  fearHorror: { 0: 'None', 1: 'Mild Tension', 2: 'Moderate', 3: 'Intense' },
}

// Age recommendation logic
function calculateRecommendedAge(content, profile) {
  const params = content.parameters
  let baseAge = 3

  // Highest risk parameter heavily influences age
  const maxViolence = params.violence
  const maxLanguage = params.language
  const maxSexual = params.sexualContent
  const maxFear = params.fearHorror

  // Age adjustments based on severity
  if (maxViolence >= 3 || maxSexual >= 2) {
    baseAge = 16
  } else if (maxViolence >= 2 || maxLanguage >= 3 || maxFear >= 3) {
    baseAge = 13
  } else if (maxViolence >= 1 || maxLanguage >= 2 || maxFear >= 2 || params.themes.death) {
    baseAge = 10
  } else if (maxViolence >= 1 || maxLanguage >= 1 || maxFear >= 1) {
    baseAge = 7
  }

  // Profile-specific adjustments
  if (profile) {
    if (profile.sensitivities?.fearSensitive && params.fearHorror >= 2) {
      baseAge = Math.max(baseAge, profile.age + 2)
    }
    if (profile.sensitivities?.violenceSensitive && params.violence >= 1) {
      baseAge = Math.max(baseAge, profile.age + 1)
    }
  }

  // Round to common age bands
  if (baseAge <= 5) return 3
  if (baseAge <= 7) return 7
  if (baseAge <= 10) return 10
  if (baseAge <= 13) return 13
  return 16
}

// Calculate verdict (Red/Yellow/Green)
function calculateVerdict(content, profile, recommendedAge) {
  const params = content.parameters
  const hasHighRisk = params.violence >= 3 || params.sexualContent >= 2 || params.fearHorror >= 3
  const hasModerateRisk = params.violence >= 2 || params.language >= 2 || params.fearHorror >= 2

  if (hasHighRisk) return 'warning'
  if (hasModerateRisk) return 'caution'
  return 'safe'
}

export async function analyzeContent(input, contentType, profile) {
  // Normalize input
  const normalizedInput = input.toLowerCase().trim()

  // Try to use AI API first
  try {
    const aiAnalysis = await analyzeContentWithAI(input, contentType, profile)
    
    // Use AI's recommended age or calculate our own
    const recommendedAge = aiAnalysis.recommendedAge || calculateRecommendedAge(aiAnalysis, profile)
    const verdict = calculateVerdict(aiAnalysis, profile, recommendedAge)

    return {
      content: {
        title: aiAnalysis.title,
        type: aiAnalysis.type,
        parameters: aiAnalysis.parameters,
        notes: aiAnalysis.notes,
        reasoning: aiAnalysis.reasoning,
      },
      recommendedAge,
      verdict,
      confidence: 'high', // AI analysis is high confidence
      profile,
      parameterLabels: PARAMETER_LABELS,
    }
  } catch (error) {
    console.warn('API analysis failed, falling back to mock data:', error)
    
    // Fallback to mock data
    let content = CONTENT_DATABASE[normalizedInput]

    // If not found in mock database, generate mock data
    if (!content) {
      content = {
        title: input,
        type: contentType,
        parameters: {
          violence: Math.floor(Math.random() * 2), // 0-1 for demo
          language: Math.floor(Math.random() * 2),
          sexualContent: 0,
          romanticContent: Math.floor(Math.random() * 2),
          substanceUse: 0,
          fearHorror: Math.floor(Math.random() * 2),
          themes: {
            death: Math.random() > 0.7,
            bullying: Math.random() > 0.8,
            mentalHealth: false,
            moralAmbiguity: false,
          },
          valuesSensitive: {
            lgbtq: false,
            genderIdentity: false,
            religious: false,
            political: false,
          },
        },
        notes: error.message.includes('API key') 
          ? 'API key not configured. Please set VITE_OPENAI_API_KEY in your .env file for real analysis.'
          : 'This is a mock analysis. API call failed, so using fallback data.',
      }
    }

    const recommendedAge = calculateRecommendedAge(content, profile)
    const verdict = calculateVerdict(content, profile, recommendedAge)

    // Calculate confidence
    const confidence = CONTENT_DATABASE[normalizedInput] ? 'high' : 'medium'

    return {
      content,
      recommendedAge,
      verdict,
      confidence,
      profile,
      parameterLabels: PARAMETER_LABELS,
      error: error.message, // Include error for debugging
    }
  }
}
