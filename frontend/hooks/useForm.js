import { useState } from 'react'

export const useForm = (initialValues = {}, validationRules = {}) => {
  const [formData, setFormData] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const newErrors = {}
    
    Object.keys(validationRules).forEach(field => {
      const rules = validationRules[field]
      const value = formData[field]
      
      if (rules.required && (!value || value.toString().trim() === '')) {
        newErrors[field] = rules.required
      } else if (rules.minLength && value && value.length < rules.minLength.value) {
        newErrors[field] = rules.minLength.message
      } else if (rules.pattern && value && !rules.pattern.value.test(value)) {
        newErrors[field] = rules.pattern.message
      } else if (rules.validate && value) {
        const customError = rules.validate(value)
        if (customError) newErrors[field] = customError
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const onSubmit = async (submitFn) => {
    if (!validate()) return
    
    setIsSubmitting(true)
    try {
      await submitFn(formData)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const reset = () => {
    setFormData(initialValues)
    setErrors({})
    setIsSubmitting(false)
  }

  return {
    formData,
    errors,
    isSubmitting,
    setFormData: handleChange,
    onSubmit,
    reset,
    validate,
  }
}