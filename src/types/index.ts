export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: 'citizen' | 'authority' | 'admin' | 'ngo'
  department?: string
  createdAt: Date
  updatedAt: Date
}

export interface Complaint {
  id: string
  userId: string
  category: ComplaintCategory
  subject: string
  description: string
  location: string
  priority: Priority
  status: ComplaintStatus
  attachments?: string[]
  assignedTo?: string
  assignedDepartment?: string
  submittedAt: Date
  updatedAt: Date
  resolvedAt?: Date
  feedback?: ComplaintFeedback
  updates: ComplaintUpdate[]
}

export interface ComplaintUpdate {
  id: string
  complaintId: string
  message: string
  status: ComplaintStatus
  updatedBy: string
  updatedAt: Date
  attachments?: string[]
}

export interface ComplaintFeedback {
  rating: number
  comment?: string
  submittedAt: Date
}

export type ComplaintCategory = 
  | 'sanitation'
  | 'infrastructure'
  | 'publicServices'
  | 'utilities'
  | 'transportation'
  | 'other'

export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export type ComplaintStatus = 
  | 'pending'
  | 'inProgress'
  | 'resolved'
  | 'escalated'
  | 'closed'

export interface Department {
  id: string
  name: string
  description: string
  categories: ComplaintCategory[]
  contactEmail: string
  contactPhone?: string
}

export interface Statistics {
  totalComplaints: number
  pendingComplaints: number
  inProgressComplaints: number
  resolvedComplaints: number
  escalatedComplaints: number
  averageResolutionTime: number
  complaintsByCategory: Record<ComplaintCategory, number>
  complaintsByPriority: Record<Priority, number>
  monthlyTrends: Array<{
    month: string
    submitted: number
    resolved: number
  }>
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  loading: boolean
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  password: string
}

export interface ComplaintContextType {
  complaints: Complaint[]
  submitComplaint: (complaintData: Omit<Complaint, 'id' | 'userId' | 'submittedAt' | 'updatedAt' | 'updates'>) => Promise<string>
  updateComplaint: (id: string, updates: Partial<Complaint>) => Promise<void>
  getComplaint: (id: string) => Complaint | undefined
  getComplaintsByUser: (userId: string) => Complaint[]
  trackComplaint: (id: string) => Promise<Complaint | null>
  loading: boolean
}