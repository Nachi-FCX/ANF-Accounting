// useApiState - Generic API State Management Composable

import { ref, computed } from 'vue'
import type { ApiState } from '@/types/common'

export function useApiState() {
  // State
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)

  // Computed
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => !!error.value)
  const isSuccess = computed(() => success.value)
  const isIdle = computed(() => !loading.value && !error.value && !success.value)

  // Actions
  const setLoading = (isLoading: boolean) => {
    loading.value = isLoading
    if (isLoading) {
      error.value = null
      success.value = false
    }
  }

  const setError = (errorMessage: string | null) => {
    error.value = errorMessage
    loading.value = false
    success.value = false
  }

  const setSuccess = (isSuccess: boolean = true) => {
    success.value = isSuccess
    loading.value = false
    error.value = null
  }

  const reset = () => {
    loading.value = false
    error.value = null
    success.value = false
  }

  const clearError = () => {
    error.value = null
  }

  // Generic async operation wrapper
  const executeAsync = async <T>(
    operation: () => Promise<T>,
    options?: {
      onSuccess?: (result: T) => void
      onError?: (error: any) => void
      successMessage?: string
      errorMessage?: string
    }
  ): Promise<T | null> => {
    try {
      setLoading(true)
      
      const result = await operation()
      
      setSuccess(true)
      
      if (options?.onSuccess) {
        options.onSuccess(result)
      }
      
      return result
    } catch (err: any) {
      const errorMsg = options?.errorMessage || err.message || 'An error occurred'
      setError(errorMsg)
      
      if (options?.onError) {
        options.onError(err)
      }
      
      return null
    }
  }

  // Multiple operations wrapper
  const executeMultiple = async <T>(
    operations: Array<() => Promise<T>>,
    options?: {
      stopOnError?: boolean
      onProgress?: (completed: number, total: number) => void
      onSuccess?: (results: T[]) => void
      onError?: (error: any, index: number) => void
    }
  ): Promise<T[]> => {
    const results: T[] = []
    const { stopOnError = true } = options || {}

    try {
      setLoading(true)

      for (let i = 0; i < operations.length; i++) {
        try {
          const result = await operations[i]()
          results.push(result)
          
          if (options?.onProgress) {
            options.onProgress(i + 1, operations.length)
          }
        } catch (err) {
          if (options?.onError) {
            options.onError(err, i)
          }
          
          if (stopOnError) {
            throw err
          }
        }
      }

      setSuccess(true)
      
      if (options?.onSuccess) {
        options.onSuccess(results)
      }
      
      return results
    } catch (err: any) {
      setError(err.message || 'Multiple operations failed')
      return results
    }
  }

  // Retry wrapper
  const executeWithRetry = async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000,
    options?: {
      onRetry?: (attempt: number, error: any) => void
      onSuccess?: (result: T) => void
      onError?: (error: any) => void
    }
  ): Promise<T | null> => {
    let lastError: any

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        setLoading(true)
        
        const result = await operation()
        
        setSuccess(true)
        
        if (options?.onSuccess) {
          options.onSuccess(result)
        }
        
        return result
      } catch (err) {
        lastError = err
        
        if (options?.onRetry && attempt < maxRetries) {
          options.onRetry(attempt, err)
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }

    // All retries failed
    setError(lastError?.message || 'Operation failed after retries')
    
    if (options?.onError) {
      options.onError(lastError)
    }
    
    return null
  }

  // State object for easy destructuring
  const state = computed<ApiState>(() => ({
    loading: loading.value,
    error: error.value,
    success: success.value
  }))

  return {
    // State
    loading,
    error,
    success,
    state,
    
    // Computed
    isLoading,
    hasError,
    isSuccess,
    isIdle,
    
    // Actions
    setLoading,
    setError,
    setSuccess,
    reset,
    clearError,
    executeAsync,
    executeMultiple,
    executeWithRetry
  }
}

export default useApiState
