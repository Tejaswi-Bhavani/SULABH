import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase, getCurrentUserProfile } from '../lib/supabase'
import { User, AuthContextType, RegisterData } from '../types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await loadUserProfile(session.user)
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session?.user) {
        await loadUserProfile(session.user)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const profile = await getCurrentUserProfile()
      if (profile) {
        setUser({
          id: profile.id,
          email: profile.email,
          firstName: profile.first_name,
          lastName: profile.last_name,
          phone: profile.phone || undefined,
          role: profile.role,
          department: profile.department || undefined,
          createdAt: new Date(profile.created_at),
          updatedAt: new Date(profile.updated_at)
        })
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      if (data.user) {
        await loadUserProfile(data.user)
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: RegisterData): Promise<void> => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone
          }
        }
      })

      if (error) {
        // Enhanced error handling for user already exists scenarios
        const errorMessage = error.message?.toLowerCase() || ''
        const errorCode = (error as any).code || ''
        
        // Check for various forms of "user already exists" errors
        if (errorCode === 'user_already_exists' || 
            errorMessage.includes('user already registered') || 
            errorMessage.includes('user already exists') ||
            errorMessage.includes('already registered') ||
            errorMessage.includes('email address is already registered')) {
          throw new Error('This email is already registered. Please log in or use a different email.')
        }
        
        throw error
      }

      if (data.user) {
        // Update profile with additional information
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            phone: userData.phone,
            role: 'citizen'
          })
          .eq('id', data.user.id)

        if (profileError) throw profileError

        await loadUserProfile(data.user)
      }
    } catch (error: any) {
      // Re-throw the specific error message if it's our custom one
      if (error.message?.includes('This email is already registered')) {
        throw error
      }
      
      // Handle any other registration errors with a user-friendly message
      const errorMessage = error.message || 'Registration failed'
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}