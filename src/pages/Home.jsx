import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, Book, Film, AlertCircle } from 'lucide-react'
import { analyzeContent } from '../utils/contentAnalyzer'
import { useProfiles } from '../context/ProfileContext'

export default function Home() {
  const [contentType, setContentType] = useState('book')
  const [input, setInput] = useState('')
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const navigate = useNavigate()
  const { profiles } = useProfiles()

  const handleAnalyze = async () => {
    if (!input.trim()) {
      alert('Please enter a title or ISBN')
      return
    }

    if (!selectedProfile && profiles.length > 0) {
      alert('Please select a child profile')
      return
    }

    setIsAnalyzing(true)

    try {
      const result = await analyzeContent(input, contentType, selectedProfile)
      navigate('/results', { state: { result, input, contentType } })
    } catch (error) {
      console.error('Analysis error:', error)
      alert(`Error analyzing content: ${error.message}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Quick Safety Check for Kids' Content
        </h1>
        <p className="text-xl text-gray-600">
          Get an honest, personalized safety rating based on your values
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        {/* Content Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What are you checking?
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setContentType('book')}
              className={`flex-1 flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
                contentType === 'book'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Book className="h-5 w-5 mr-2" />
              Book
            </button>
            <button
              onClick={() => setContentType('movie')}
              className={`flex-1 flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
                contentType === 'movie'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Film className="h-5 w-5 mr-2" />
              Movie / TV Show
            </button>
          </div>
        </div>

        {/* Input Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {contentType === 'book' ? 'Book Title or ISBN' : 'Movie / TV Show Title'}
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder={contentType === 'book' ? 'e.g., "Harry Potter" or "9780439708180"' : 'e.g., "Frozen" or "Stranger Things"'}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Profile Selection */}
        {profiles.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Child Profile
            </label>
            <select
              value={selectedProfile?.id || ''}
              onChange={(e) => {
                const profile = profiles.find(p => p.id === e.target.value)
                setSelectedProfile(profile || null)
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a profile...</option>
              {profiles.map(profile => (
                <option key={profile.id} value={profile.id}>
                  {profile.name} (Age {profile.age})
                </option>
              ))}
            </select>
          </div>
        )}

        {profiles.length === 0 && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-amber-800">
                <strong>No profiles yet.</strong> You can analyze content without a profile, or{' '}
                <Link to="/profiles" className="underline font-medium">create one</Link> for personalized recommendations.
              </p>
            </div>
          </div>
        )}

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !input.trim()}
          className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isAnalyzing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            'Analyze Content'
          )}
        </button>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>Results in under 30 seconds • Based on your values, not generic ratings</p>
      </div>
    </div>
  )
}
