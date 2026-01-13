import { useState } from 'react'
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react'
import { useProfiles } from '../context/ProfileContext'

export default function Profiles() {
  const { profiles, addProfile, updateProfile, deleteProfile } = useProfiles()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    sensitivities: {
      fearSensitive: false,
      violenceSensitive: false,
    },
    notes: '',
  })

  const handleAdd = () => {
    if (!formData.name || !formData.age) {
      alert('Please fill in name and age')
      return
    }
    addProfile({
      ...formData,
      age: parseInt(formData.age),
    })
    resetForm()
    setIsAdding(false)
  }

  const handleUpdate = (id) => {
    updateProfile(id, {
      ...formData,
      age: parseInt(formData.age),
    })
    resetForm()
    setEditingId(null)
  }

  const handleEdit = (profile) => {
    setFormData({
      name: profile.name,
      age: profile.age.toString(),
      sensitivities: profile.sensitivities || {
        fearSensitive: false,
        violenceSensitive: false,
      },
      notes: profile.notes || '',
    })
    setEditingId(profile.id)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      sensitivities: {
        fearSensitive: false,
        violenceSensitive: false,
      },
      notes: '',
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Child Profiles</h1>
          <p className="text-gray-600">Manage profiles for personalized recommendations</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => {
              setIsAdding(true)
              resetForm()
            }}
            className="flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Profile
          </button>
        )}
      </div>

      {/* Add New Profile Form */}
      {isAdding && (
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Child's name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="number"
                min="3"
                max="16"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="Age"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sensitivities</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.sensitivities.fearSensitive}
                    onChange={(e) => setFormData({
                      ...formData,
                      sensitivities: { ...formData.sensitivities, fearSensitive: e.target.checked }
                    })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Sensitive to fear/horror</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.sensitivities.violenceSensitive}
                    onChange={(e) => setFormData({
                      ...formData,
                      sensitivities: { ...formData.sensitivities, violenceSensitive: e.target.checked }
                    })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Sensitive to violence</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional notes about this child..."
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                className="flex items-center bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </button>
              <button
                onClick={() => {
                  setIsAdding(false)
                  resetForm()
                }}
                className="flex items-center bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile List */}
      <div className="space-y-4">
        {profiles.length === 0 && !isAdding && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <p className="text-gray-600 mb-4">No profiles yet. Create one to get started!</p>
            <button
              onClick={() => setIsAdding(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            >
              Create First Profile
            </button>
          </div>
        )}

        {profiles.map(profile => (
          <div key={profile.id} className="bg-white rounded-2xl shadow-xl p-6">
            {editingId === profile.id ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    min="3"
                    max="16"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sensitivities</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.sensitivities.fearSensitive}
                        onChange={(e) => setFormData({
                          ...formData,
                          sensitivities: { ...formData.sensitivities, fearSensitive: e.target.checked }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Sensitive to fear/horror</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.sensitivities.violenceSensitive}
                        onChange={(e) => setFormData({
                          ...formData,
                          sensitivities: { ...formData.sensitivities, violenceSensitive: e.target.checked }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Sensitive to violence</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdate(profile.id)}
                    className="flex items-center bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null)
                      resetForm()
                    }}
                    className="flex items-center bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
                    <p className="text-gray-600">Age {profile.age}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(profile)}
                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete profile for ${profile.name}?`)) {
                          deleteProfile(profile.id)
                        }
                      }}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                {(profile.sensitivities?.fearSensitive || profile.sensitivities?.violenceSensitive || profile.notes) && (
                  <div className="space-y-2 text-sm text-gray-600">
                    {profile.sensitivities?.fearSensitive && (
                      <div className="flex items-center">
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs mr-2">Fear Sensitive</span>
                      </div>
                    )}
                    {profile.sensitivities?.violenceSensitive && (
                      <div className="flex items-center">
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs mr-2">Violence Sensitive</span>
                      </div>
                    )}
                    {profile.notes && (
                      <p className="mt-2">{profile.notes}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
