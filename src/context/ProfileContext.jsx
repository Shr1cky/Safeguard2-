import { createContext, useContext, useState, useEffect } from 'react'

const ProfileContext = createContext()

export function ProfileProvider({ children }) {
  const [profiles, setProfiles] = useState(() => {
    const saved = localStorage.getItem('childProfiles')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('childProfiles', JSON.stringify(profiles))
  }, [profiles])

  const addProfile = (profile) => {
    const newProfile = {
      ...profile,
      id: Date.now().toString(),
    }
    setProfiles([...profiles, newProfile])
    return newProfile
  }

  const updateProfile = (id, updates) => {
    setProfiles(profiles.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  const deleteProfile = (id) => {
    setProfiles(profiles.filter(p => p.id !== id))
  }

  return (
    <ProfileContext.Provider value={{ profiles, addProfile, updateProfile, deleteProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfiles() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfiles must be used within ProfileProvider')
  }
  return context
}
