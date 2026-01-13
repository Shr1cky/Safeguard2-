import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronUp, Info, ArrowLeft } from 'lucide-react'
import { useState } from 'react'

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const { result, input, contentType } = location.state || {}
  const [expandedParams, setExpandedParams] = useState({})

  if (!result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 mb-4">No results found. Please start a new search.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          Go Back
        </button>
      </div>
    )
  }

  const { content, recommendedAge, verdict, confidence, parameterLabels } = result

  const verdictConfig = {
    safe: {
      icon: CheckCircle,
      color: 'text-safe',
      bgColor: 'bg-green-50',
      borderColor: 'border-safe',
      label: 'Safe',
    },
    caution: {
      icon: AlertTriangle,
      color: 'text-caution',
      bgColor: 'bg-amber-50',
      borderColor: 'border-caution',
      label: 'Caution',
    },
    warning: {
      icon: XCircle,
      color: 'text-warning',
      bgColor: 'bg-red-50',
      borderColor: 'border-warning',
      label: 'Not Recommended',
    },
  }

  const config = verdictConfig[verdict]
  const VerdictIcon = config.icon

  const toggleParam = (param) => {
    setExpandedParams({ ...expandedParams, [param]: !expandedParams[param] })
  }

  const getParameterNotes = (param, value) => {
    const notes = {
      violence: {
        0: 'No violence present',
        1: 'Cartoon-style action, mild conflict',
        2: 'Moderate action scenes, some intensity',
        3: 'Graphic violence, realistic depictions',
      },
      language: {
        0: 'No profanity',
        1: 'Mild language, occasional words',
        2: 'Frequent strong language',
        3: 'Explicit profanity throughout',
      },
      sexualContent: {
        0: 'No sexual content',
        1: 'Implied romantic situations',
        2: 'Explicit sexual content',
      },
      romanticContent: {
        0: 'No romantic themes',
        1: 'Light romantic subplot',
        2: 'Romance is central to the story',
      },
      substanceUse: {
        0: 'No substance use',
        1: 'Casual references or depictions',
        2: 'Frequent substance use',
      },
      fearHorror: {
        0: 'No scary content',
        1: 'Mild tension, suspense',
        2: 'Moderate scary scenes',
        3: 'Intense horror, disturbing imagery',
      },
    }
    return notes[param]?.[value] || 'See details below'
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        New Search
      </button>

      {/* Top Summary */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{content.title}</h1>
            <p className="text-gray-600 capitalize">{content.type}</p>
          </div>
          <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-lg p-4 flex items-center`}>
            <VerdictIcon className={`h-8 w-8 ${config.color} mr-2`} />
            <div>
              <div className={`font-bold ${config.color}`}>{config.label}</div>
              <div className="text-sm text-gray-600">Ages {recommendedAge}+</div>
            </div>
          </div>
        </div>

        <div className={`${config.bgColor} rounded-lg p-4 mb-6`}>
          <div className="flex items-start">
            <Info className={`h-5 w-5 ${config.color} mr-2 mt-0.5`} />
            <div>
              <p className={`font-medium ${config.color} mb-1`}>
                {verdict === 'safe' && `✅ Safe for ages ${recommendedAge}+`}
                {verdict === 'caution' && `🟡 Caution: Best for ages ${recommendedAge}+ with supervision`}
                {verdict === 'warning' && `🔴 Not recommended for ages under ${recommendedAge}`}
              </p>
              {content.notes && (
                <p className="text-sm text-gray-700">{content.notes}</p>
              )}
            </div>
          </div>
        </div>

        {/* Confidence Level */}
        <div className="text-sm text-gray-600 mb-4">
          <strong>Confidence:</strong> {confidence.charAt(0).toUpperCase() + confidence.slice(1)}
          {result.error && (
            <span className="ml-2 text-amber-600">(Using fallback data - API unavailable)</span>
          )}
        </div>

        {/* AI Reasoning */}
        {content.reasoning && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h3 className="font-semibold text-indigo-900 mb-2">Why {recommendedAge}+?</h3>
            <p className="text-sm text-indigo-800">{content.reasoning}</p>
          </div>
        )}
      </div>

      {/* Parameter Breakdown */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Safety Breakdown</h2>
        
        <div className="space-y-3">
          {Object.entries(parameterLabels).map(([param, labels]) => {
            const value = content.parameters[param]
            const label = labels[value] || 'Unknown'
            const isExpanded = expandedParams[param]
            const notes = getParameterNotes(param, value)

            return (
              <div key={param} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleParam(param)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center flex-1">
                    <span className="font-medium text-gray-900 capitalize mr-4 min-w-[140px]">
                      {param.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      value === 0 ? 'bg-green-100 text-green-800' :
                      value === 1 ? 'bg-yellow-100 text-yellow-800' :
                      value === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {label}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3">
                    {notes}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Themes Section */}
        {Object.values(content.parameters.themes).some(v => v) && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Themes Present</h3>
            <div className="flex flex-wrap gap-2">
              {content.parameters.themes.death && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Death</span>
              )}
              {content.parameters.themes.bullying && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Bullying</span>
              )}
              {content.parameters.themes.mentalHealth && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Mental Health</span>
              )}
              {content.parameters.themes.moralAmbiguity && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Moral Ambiguity</span>
              )}
            </div>
          </div>
        )}

        {/* Values-Sensitive Topics */}
        {Object.values(content.parameters.valuesSensitive).some(v => v) && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Values-Sensitive Topics</h3>
            <div className="flex flex-wrap gap-2">
              {content.parameters.valuesSensitive.lgbtq && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">LGBTQ+ Themes</span>
              )}
              {content.parameters.valuesSensitive.genderIdentity && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Gender Identity</span>
              )}
              {content.parameters.valuesSensitive.religious && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Religious Themes</span>
              )}
              {content.parameters.valuesSensitive.political && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Political/Social Themes</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Parent Tip */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Parent Tip</h3>
        <p className="text-blue-800">
          {recommendedAge <= 7 && 'This content is generally appropriate for younger children.'}
          {recommendedAge > 7 && recommendedAge <= 10 && 'Consider watching or reading together to discuss themes as they arise.'}
          {recommendedAge > 10 && recommendedAge <= 13 && 'Best enjoyed with parental guidance and discussion about mature themes.'}
          {recommendedAge > 13 && 'Contains mature content. Review the breakdown above and consider your child\'s maturity level.'}
        </p>
      </div>

      {/* Trust & Transparency */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Trust & Transparency</h2>
        
        <div className="space-y-4 text-sm text-gray-600">
          <div>
            <strong className="text-gray-900">Sources Used:</strong>
            <p className="mt-1">
              Content analysis based on aggregated reviews, plot summaries, and content databases. 
              This is a demo version with mock data.
            </p>
          </div>
          
          <div>
            <strong className="text-gray-900">AI Confidence Disclaimer:</strong>
            <p className="mt-1">
              Recommendations are generated using automated analysis. Always use your own judgment 
              and consider your child's individual sensitivities and maturity level.
            </p>
          </div>

          <button className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium">
            Report an Issue
          </button>
        </div>
      </div>
    </div>
  )
}
