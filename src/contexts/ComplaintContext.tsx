import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Complaint, ComplaintContextType } from '../types'
import { useAuth } from './AuthContext'

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined)

export const useComplaints = () => {
  const context = useContext(ComplaintContext)
  if (context === undefined) {
    throw new Error('useComplaints must be used within a ComplaintProvider')
  }
  return context
}

interface ComplaintProviderProps {
  children: ReactNode
}

// Mock data for demonstration
const mockComplaints: Complaint[] = [
  {
    id: 'CMP001',
    userId: '1',
    category: 'sanitation',
    subject: 'Garbage not collected for 3 days',
    description: 'The garbage in our area has not been collected for the past 3 days. It is causing health issues and bad smell.',
    location: 'Sector 15, Noida',
    priority: 'high',
    status: 'inProgress',
    assignedTo: 'Municipal Worker #123',
    assignedDepartment: 'Sanitation Department',
    submittedAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
    updates: [
      {
        id: 'UPD001',
        complaintId: 'CMP001',
        message: 'Complaint received and assigned to sanitation team',
        status: 'inProgress',
        updatedBy: 'System',
        updatedAt: new Date('2024-01-15')
      }
    ]
  },
  {
    id: 'CMP002',
    userId: '1',
    category: 'infrastructure',
    subject: 'Pothole on main road',
    description: 'Large pothole on the main road causing traffic issues and vehicle damage.',
    location: 'MG Road, Bangalore',
    priority: 'medium',
    status: 'resolved',
    assignedTo: 'Road Maintenance Team',
    assignedDepartment: 'Public Works',
    submittedAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-14'),
    resolvedAt: new Date('2024-01-14'),
    feedback: {
      rating: 4,
      comment: 'Good work, fixed quickly',
      submittedAt: new Date('2024-01-14')
    },
    updates: [
      {
        id: 'UPD002',
        complaintId: 'CMP002',
        message: 'Complaint received and assigned to road maintenance team',
        status: 'inProgress',
        updatedBy: 'System',
        updatedAt: new Date('2024-01-10')
      },
      {
        id: 'UPD003',
        complaintId: 'CMP002',
        message: 'Pothole has been filled and road repaired',
        status: 'resolved',
        updatedBy: 'Road Maintenance Team',
        updatedAt: new Date('2024-01-14')
      }
    ]
  }
]

export const ComplaintProvider: React.FC<ComplaintProviderProps> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const submitComplaint = async (complaintData: Omit<Complaint, 'id' | 'userId' | 'submittedAt' | 'updatedAt' | 'updates'>): Promise<string> => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newComplaint: Complaint = {
        ...complaintData,
        id: `CMP${String(complaints.length + 1).padStart(3, '0')}`,
        userId: user?.id || '',
        submittedAt: new Date(),
        updatedAt: new Date(),
        updates: [
          {
            id: `UPD${Date.now()}`,
            complaintId: `CMP${String(complaints.length + 1).padStart(3, '0')}`,
            message: 'Complaint submitted successfully',
            status: complaintData.status,
            updatedBy: 'System',
            updatedAt: new Date()
          }
        ]
      }
      
      setComplaints(prev => [...prev, newComplaint])
      return newComplaint.id
    } catch (error) {
      throw new Error('Failed to submit complaint')
    } finally {
      setLoading(false)
    }
  }

  const updateComplaint = async (id: string, updates: Partial<Complaint>): Promise<void> => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setComplaints(prev => prev.map(complaint => 
        complaint.id === id 
          ? { ...complaint, ...updates, updatedAt: new Date() }
          : complaint
      ))
    } catch (error) {
      throw new Error('Failed to update complaint')
    } finally {
      setLoading(false)
    }
  }

  const getComplaint = (id: string): Complaint | undefined => {
    return complaints.find(complaint => complaint.id === id)
  }

  const getComplaintsByUser = (userId: string): Complaint[] => {
    return complaints.filter(complaint => complaint.userId === userId)
  }

  const trackComplaint = async (id: string): Promise<Complaint | null> => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const complaint = complaints.find(c => c.id === id)
      return complaint || null
    } catch (error) {
      throw new Error('Failed to track complaint')
    } finally {
      setLoading(false)
    }
  }

  const value: ComplaintContextType = {
    complaints,
    submitComplaint,
    updateComplaint,
    getComplaint,
    getComplaintsByUser,
    trackComplaint,
    loading
  }

  return (
    <ComplaintContext.Provider value={value}>
      {children}
    </ComplaintContext.Provider>
  )
}