import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  FileText, 
  MapPin, 
  Upload, 
  AlertCircle,
  CheckCircle,
  Camera
} from 'lucide-react'
import { useComplaints } from '../contexts/ComplaintContext'
import { ComplaintCategory, Priority } from '../types'

const complaintSchema = z.object({
  category: z.enum(['sanitation', 'infrastructure', 'publicServices', 'utilities', 'transportation', 'other']),
  subject: z.string().min(10, 'Subject must be at least 10 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  location: z.string().min(5, 'Location must be at least 5 characters'),
  priority: z.enum(['low', 'medium', 'high', 'urgent'])
})

type ComplaintFormData = z.infer<typeof complaintSchema>

const SubmitComplaintPage: React.FC = () => {
  const { t } = useTranslation()
  const { submitComplaint, loading } = useComplaints()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      priority: 'medium'
    }
  })

  const categories: { value: ComplaintCategory; label: string }[] = [
    { value: 'sanitation', label: t('complaint.submit.categories.sanitation') },
    { value: 'infrastructure', label: t('complaint.submit.categories.infrastructure') },
    { value: 'publicServices', label: t('complaint.submit.categories.publicServices') },
    { value: 'utilities', label: t('complaint.submit.categories.utilities') },
    { value: 'transportation', label: t('complaint.submit.categories.transportation') },
    { value: 'other', label: t('complaint.submit.categories.other') }
  ]

  const priorities: { value: Priority; label: string; color: string }[] = [
    { value: 'low', label: t('complaint.submit.priorities.low'), color: 'text-success-600' },
    { value: 'medium', label: t('complaint.submit.priorities.medium'), color: 'text-warning-600' },
    { value: 'high', label: t('complaint.submit.priorities.high'), color: 'text-error-600' },
    { value: 'urgent', label: t('complaint.submit.priorities.urgent'), color: 'text-error-800' }
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setAttachments(prev => [...prev, ...files].slice(0, 5)) // Limit to 5 files
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: ComplaintFormData) => {
    try {
      setError('')
      setSuccess('')
      
      const complaintId = await submitComplaint({
        ...data,
        status: 'pending',
        attachments: attachments.map(file => file.name) // In real app, upload files first
      })
      
      setSuccess(`Complaint submitted successfully! Your complaint ID is: ${complaintId}`)
      reset()
      setAttachments([])
      
      // Redirect to complaint details after 3 seconds
      setTimeout(() => {
        navigate(`/complaint/${complaintId}`)
      }, 3000)
    } catch (err) {
      setError('Failed to submit complaint. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('complaint.submit.title')}
          </h1>
          <p className="text-gray-600">
            Provide detailed information about your grievance to help us resolve it quickly
          </p>
        </div>

        <div className="card">
          {error && (
            <div className="mb-6 bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('complaint.submit.category')} *
              </label>
              <select
                {...register('category')}
                className="input-field"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-error-600">{errors.category.message}</p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('complaint.submit.subject')} *
              </label>
              <input
                {...register('subject')}
                type="text"
                className="input-field"
                placeholder="Brief summary of your complaint"
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-error-600">{errors.subject.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('complaint.submit.description')} *
              </label>
              <textarea
                {...register('description')}
                rows={6}
                className="input-field resize-none"
                placeholder="Provide detailed information about your complaint, including when it occurred, what happened, and any other relevant details..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-error-600">{errors.description.message}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('complaint.submit.location')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('location')}
                  type="text"
                  className="input-field pl-10"
                  placeholder="Enter the specific location (address, landmark, area)"
                />
              </div>
              {errors.location && (
                <p className="mt-1 text-sm text-error-600">{errors.location.message}</p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('complaint.submit.priority')} *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {priorities.map((priority) => (
                  <label key={priority.value} className="relative">
                    <input
                      {...register('priority')}
                      type="radio"
                      value={priority.value}
                      className="sr-only peer"
                    />
                    <div className="border-2 border-gray-200 rounded-lg p-3 cursor-pointer peer-checked:border-primary-500 peer-checked:bg-primary-50 hover:bg-gray-50 transition-colors duration-200">
                      <div className={`text-sm font-medium ${priority.color}`}>
                        {priority.label}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.priority && (
                <p className="mt-1 text-sm text-error-600">{errors.priority.message}</p>
              )}
            </div>

            {/* File Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('complaint.submit.attachments')} (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors duration-200">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload photos, videos, or documents
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum 5 files, up to 10MB each
                  </p>
                </label>
              </div>

              {/* Attachment Preview */}
              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Camera className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-error-600 hover:text-error-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    <span>{t('common.submit')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SubmitComplaintPage