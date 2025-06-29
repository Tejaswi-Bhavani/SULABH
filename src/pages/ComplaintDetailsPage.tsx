import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  User, 
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Star
} from 'lucide-react'
import { useComplaints } from '../contexts/ComplaintContext'
import { format } from 'date-fns'

const ComplaintDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { getComplaint } = useComplaints()

  const complaint = id ? getComplaint(id) : null

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Complaint Not Found</h2>
            <p className="text-gray-600 mb-6">
              The complaint you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-warning-600 bg-warning-100'
      case 'inProgress': return 'text-secondary-600 bg-secondary-100'
      case 'resolved': return 'text-success-600 bg-success-100'
      case 'escalated': return 'text-error-600 bg-error-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock
      case 'inProgress': return FileText
      case 'resolved': return CheckCircle
      case 'escalated': return AlertTriangle
      default: return Clock
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-success-600 bg-success-100'
      case 'medium': return 'text-warning-600 bg-warning-100'
      case 'high': return 'text-error-600 bg-error-100'
      case 'urgent': return 'text-error-800 bg-error-200'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {complaint.subject}
              </h1>
              <p className="text-gray-600">
                Complaint ID: <span className="font-medium">{complaint.id}</span>
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                {React.createElement(getStatusIcon(complaint.status), { className: "w-4 h-4 mr-1" })}
                {t(`complaint.status.${complaint.status}`)}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(complaint.priority)}`}>
                {t(`complaint.submit.priorities.${complaint.priority}`)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Complaint Details */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Complaint Details</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Category</h3>
                  <p className="text-gray-900 capitalize">
                    {t(`complaint.submit.categories.${complaint.category}`)}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
                  <p className="text-gray-900 leading-relaxed">{complaint.description}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Location</h3>
                    <p className="text-gray-900">{complaint.location}</p>
                  </div>
                </div>

                {complaint.attachments && complaint.attachments.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Attachments</h3>
                    <div className="space-y-2">
                      {complaint.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                          <FileText className="w-4 h-4" />
                          <span>{attachment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Timeline */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Status Timeline</h2>
              <div className="space-y-6">
                {complaint.updates.map((update, index) => {
                  const StatusIcon = getStatusIcon(update.status)
                  const isLast = index === complaint.updates.length - 1
                  
                  return (
                    <div key={update.id} className="relative">
                      {!isLast && (
                        <div className="absolute left-4 top-8 w-0.5 h-6 bg-gray-200"></div>
                      )}
                      <div className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(update.status)}`}>
                          <StatusIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-gray-900">
                              {update.message}
                            </p>
                            <p className="text-sm text-gray-500">
                              {format(update.updatedAt, 'MMM dd, yyyy HH:mm')}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600">
                            Updated by: {update.updatedBy}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Feedback Section */}
            {complaint.status === 'resolved' && complaint.feedback && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Feedback</h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Rating:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= complaint.feedback!.rating
                              ? 'text-warning-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">
                      {complaint.feedback.rating}/5
                    </span>
                  </div>
                  {complaint.feedback.comment && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-1">Comment</h3>
                      <p className="text-gray-900">{complaint.feedback.comment}</p>
                    </div>
                  )}
                  <p className="text-sm text-gray-500">
                    Submitted on {format(complaint.feedback.submittedAt, 'PPP')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Submitted</p>
                    <p className="font-medium">{format(complaint.submittedAt, 'PPP')}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="font-medium">{format(complaint.updatedAt, 'PPP')}</p>
                  </div>
                </div>

                {complaint.resolvedAt && (
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-success-500" />
                    <div>
                      <p className="text-sm text-gray-600">Resolved</p>
                      <p className="font-medium">{format(complaint.resolvedAt, 'PPP')}</p>
                    </div>
                  </div>
                )}

                {complaint.assignedTo && (
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Assigned To</p>
                      <p className="font-medium">{complaint.assignedTo}</p>
                    </div>
                  </div>
                )}

                {complaint.assignedDepartment && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-medium text-gray-900">{complaint.assignedDepartment}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Support */}
            <div className="card bg-primary-50 border-primary-200">
              <h3 className="text-lg font-medium text-primary-900 mb-2">Need Help?</h3>
              <p className="text-primary-700 text-sm mb-4">
                Contact our support team if you have questions about this complaint.
              </p>
              <div className="space-y-2 text-sm text-primary-700">
                <div>
                  <strong>Email:</strong> support@sulabh.gov.in
                </div>
                <div>
                  <strong>Phone:</strong> 1800-123-4567
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComplaintDetailsPage