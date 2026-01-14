
/**
 * API Service for content analysis using OpenAI
 */
const API_BASE_URL = 'https://openai-proxy.viggolakner.workers.dev'

export async function analyzeContentWithAI(title, contentType, profile = null) {

  const profileContext = profile 
    ? `The child is ${profile.age} years old. ${profile.sensitivities?.fearSensitive ? 'They are sensitive to fear/horror. ' : ''}${profile.sensitivities?.violenceSensitive ? 'They are sensitive to violence. ' : ''}`
    : 'No specific child profile provided.'

  const prompt = `You are a content safety analyst for children's media. Analyze the following ${contentType} and provide a detailed safety assessment.

Title: "${title}"
Content Type: ${contentType}
${profileContext}

Please analyze this content and provide a JSON response with the following structure. Be thorough and accurate:

{
  "title": "exact title",
  "type": "${contentType}",
  "parameters": {
    "violence": 0-3 (0=None, 1=Mild, 2=Moderate, 3=Graphic),
    "language": 0-3 (0=Clean, 1=Mild, 2=Frequent, 3=Explicit),
    "sexualContent": 0-2 (0=None, 1=Implied, 2=Explicit),
    "romanticContent": 0-2 (0=None, 1=Light, 2=Central Theme),
    "substanceUse": 0-2 (0=None, 1=Casual, 2=Frequent),
    "fearHorror": 0-3 (0=None, 1=Mild Tension, 2=Moderate, 3=Intense),
    "themes": {
      "death": true/false,
      "bullying": true/false,
      "mentalHealth": true/false,
      "moralAmbiguity": true/false
    },
    "valuesSensitive": {
      "lgbtq": true/false,
      "genderIdentity": true/false,
      "religious": true/false,
      "political": true/false
    }
  },
  "notes": "Brief summary of key content concerns and positive aspects",
  "recommendedAge": 3-16,
  "reasoning": "Brief explanation of why this age was recommended"
}

Important guidelines:
- Be objective and factual about what content is present
- Consider the child's age and sensitivities if provided
- For violence: Consider intensity, frequency, and realism
- For language: Consider profanity, crude humor, and inappropriate references
- For sexual content: Consider innuendo, romantic situations, and explicit content
- For fear/horror: Consider scary scenes, dark themes, and intensity
- Mark themes as true only if they are significantly present
- Recommended age should reflect the highest risk parameter
- Provide honest, balanced assessment

Return ONLY valid JSON, no additional text.`

  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using gpt-4o-mini for cost efficiency, can be changed to gpt-4 or gpt-3.5-turbo
        messages: [
          {
            role: 'system',
            content: 'You are a professional content safety analyst specializing in children\'s media. You provide accurate, objective assessments in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent, factual responses
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`API request failed: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No response content from API')
    }

    // Parse JSON response
    const analysis = JSON.parse(content)

    // Validate and normalize the response
    return {
      title: analysis.title || title,
      type: analysis.type || contentType,
      parameters: {
        violence: Math.max(0, Math.min(3, analysis.parameters?.violence || 0)),
        language: Math.max(0, Math.min(3, analysis.parameters?.language || 0)),
        sexualContent: Math.max(0, Math.min(2, analysis.parameters?.sexualContent || 0)),
        romanticContent: Math.max(0, Math.min(2, analysis.parameters?.romanticContent || 0)),
        substanceUse: Math.max(0, Math.min(2, analysis.parameters?.substanceUse || 0)),
        fearHorror: Math.max(0, Math.min(3, analysis.parameters?.fearHorror || 0)),
        themes: {
          death: analysis.parameters?.themes?.death || false,
          bullying: analysis.parameters?.themes?.bullying || false,
          mentalHealth: analysis.parameters?.themes?.mentalHealth || false,
          moralAmbiguity: analysis.parameters?.themes?.moralAmbiguity || false,
        },
        valuesSensitive: {
          lgbtq: analysis.parameters?.valuesSensitive?.lgbtq || false,
          genderIdentity: analysis.parameters?.valuesSensitive?.genderIdentity || false,
          religious: analysis.parameters?.valuesSensitive?.religious || false,
          political: analysis.parameters?.valuesSensitive?.political || false,
        },
      },
      notes: analysis.notes || 'Content analysis completed.',
      recommendedAge: Math.max(3, Math.min(16, analysis.recommendedAge || 10)),
      reasoning: analysis.reasoning || '',
    }
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}
