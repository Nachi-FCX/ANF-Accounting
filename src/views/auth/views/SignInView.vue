<template>
  <AuthLayoutCentered>
    <!-- Show OTP Verification Form when email verification is required -->
    <OtpVerificationForm v-if="authStore.authStep === 'otp-verification'" />
    <!-- Show SignIn Form by default -->
    <SignInForm v-else />
  </AuthLayoutCentered>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AuthLayoutCentered from '../components/AuthLayoutCentered.vue'
import SignInForm from '../components/SignInForm.vue'
import OtpVerificationForm from '../components/OtpVerificationForm.vue'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()

// Clear any leftover auth state when component mounts
onMounted(() => {
  // Only reset if not already in a clean idle state
  if (authStore.authStep !== 'idle') {
    authStore.resetAuthFlow()
  }
  
  // Clear any signup form data that might interfere
  authStore.setSignupFormData(null)
  
  // Clear any success/error states
  authStore.clearStates()
})
</script>
