import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  
  // Initialize from localStorage or default to false
  const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')
  
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)

  const login = (email, password) => {
    // Mock login logic
    isAuthenticated.value = true
    user.value = { email, name: email.split('@')[0] }
    
    // Persist to localStorage
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('user', JSON.stringify(user.value))
    
    return true
  }

  const register = (email, password) => {
    // Mock registration (same as login for now)
    return login(email, password)
  }

  const logout = () => {
    isAuthenticated.value = false
    user.value = null
    
    // Clear localStorage
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    
    // Redirect to login is handled by component or router
  }

  return {
    isAuthenticated,
    user,
    login,
    register,
    logout
  }
})
