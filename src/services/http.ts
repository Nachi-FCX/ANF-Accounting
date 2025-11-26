import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { getApiBaseUrl, getApiTimeout, isLoggingEnabled } from './config'
import type { ApiResponse, ApiError, ApiSuccessResponse, ApiErrorResponse } from './types'
import { STORAGE_KEYS } from '@/views/auth/constants/auth-constants'

class HttpService {
  private client: AxiosInstance
  private static instance: HttpService

  private constructor() {
    this.client = axios.create({
      baseURL: getApiBaseUrl(),
      timeout: getApiTimeout(),
      headers: {
        'Content-Type': 'application/json'
      },
      validateStatus: function (status) {
        return (status >= 200 && status < 300) || status === 404
      }
    })

    this.setupInterceptors()
  }

  public static getInstance(): HttpService {
    if (!HttpService.instance) {
      HttpService.instance = new HttpService()
    }
    return HttpService.instance
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Get auth token from localStorage
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)

        // Add Authorization header if token exists
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`
        }

        // Log request details for debugging (only if logging is enabled)
        if (isLoggingEnabled()) {
          console.log('🚀 API Request:', {
            url: `${config.baseURL}${config.url}`,
            method: config.method?.toUpperCase(),
            headers: config.headers,
            data: config.data,
            params: config.params
          })
        }

        return config
      },
      (error) => {
        console.error('❌ Request interceptor error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log response details for debugging (only if logging is enabled)
        if (isLoggingEnabled()) {
          console.log('✅ API Response:', {
            url: response.config.url,
            status: response.status,
            statusText: response.statusText,
            data: response.data
          })
        }

        // Handle successful response
        // Your API returns: { data: {...}, success: true } or { error: {...}, success: false }
        if (response.data && typeof response.data === 'object') {
          return response.data
        }

        // Parse string response if needed
        if (typeof response.data === 'string') {
          try {
            response.data = JSON.parse(response.data)
          } catch (e) {
            console.error('Error parsing response:', e)
            return response.data
          }
        }

        return response.data
      },
      (error) => {
        // Log the error details
        console.error('❌ API Error:', {
          message: error?.message,
          response: error?.response?.data,
          status: error?.response?.status,
          url: error?.config?.url,
          method: error?.config?.method?.toUpperCase()
        })

        // Handle your API error format: { error: { message: "..." }, success: false }
        let apiError: ApiError

        if (error?.response?.data) {
          const responseData = error.response.data

          // Handle your specific API error format
          if (responseData.success === false && responseData.error) {
            apiError = {
              code: error.response.status?.toString() || 'UNKNOWN',
              message: responseData.error.message || 'An error occurred',
              status: error.response.status,
              details: responseData.error
            }
          } else {
            // Handle other error formats
            apiError = {
              code: error.response.status?.toString() || error?.code || 'UNKNOWN',
              message: this.extractErrorMessage(error),
              status: error.response.status,
              details: error.response.data
            }
          }
        } else {
          // Network or other errors
          apiError = {
            code: error?.code || 'NETWORK_ERROR',
            message: error?.message || 'Network error occurred',
            details: error
          }
        }

        // Handle specific error cases
        if (error?.response?.status === 401) {
          // Handle unauthorized access - clear auth data and redirect
          this.handleUnauthorized()
        }

        // Handle certificate errors in development
        if (isLoggingEnabled() && error?.code === 'ERR_CERT_AUTHORITY_INVALID') {
          console.warn('⚠️ Certificate error in development. You may need to accept the certificate in your browser.')
        }

        return Promise.reject(apiError)
      }
    )
  }

  private extractErrorMessage(error: any): string {
    return error?.response?.data?.error?.message || // Your API error format
           error?.response?.data?.message || // Alternative API error format
           error?.message || // Axios error message
           'An unexpected error occurred' // Default message
  }

  private handleUnauthorized(): void {
    // Clear auth data
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER_DATA)
    localStorage.removeItem(STORAGE_KEYS.CURRENT_COMPANY)

    // Redirect to login page
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      if (currentPath !== '/auth/signin' && !currentPath.startsWith('/auth/')) {
        window.location.href = '/auth/signin'
      }
    }
  }

  // HTTP Methods
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get(url, config)
      return response as T
    } catch (error) {
      console.error(`GET request failed for ${url}:`, error)
      throw error
    }
  }

  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.post(url, data, config)
      return response as T
    } catch (error) {
      console.error(`POST request failed for ${url}:`, error)
      throw error
    }
  }

  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.put(url, data, config)
      return response as T
    } catch (error) {
      console.error(`PUT request failed for ${url}:`, error)
      throw error
    }
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.delete(url, config)
      return response as T
    } catch (error) {
      console.error(`DELETE request failed for ${url}:`, error)
      throw error
    }
  }

  public async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.patch(url, data, config)
      return response as T
    } catch (error) {
      console.error(`PATCH request failed for ${url}:`, error)
      throw error
    }
  }

  // Utility methods
  public setAuthToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
  }

  public clearAuthToken(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
  }

  public getAuthToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  }
}

export const http = HttpService.getInstance()
