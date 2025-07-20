<template>
  <v-container fluid class="fill-height d-flex align-center justify-center light-bg">
    <v-card class="pa-8 rounded-xl" max-width="460" elevation="6">
      <v-card-title class="justify-center">
        <div class="text-center w-100">
          <v-icon size="40" color="blue darken-2">mdi-lock-reset</v-icon>
          <h2 class="font-weight-bold mt-2">Forgot Password</h2>
        </div>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="sendResetLink">
          <v-text-field
            v-model="email"
            label="Email"
            prepend-icon="mdi-email"
            outlined
            dense
            rounded
            class="mb-4"
            required
            type="email"
          />

          <v-btn :loading="loading" color="blue darken-2" dark block rounded type="submit">
            Send Reset Link
          </v-btn>

          <div class="text-center mt-4">
            <nuxt-link to="/auth/signin" class="text-caption blue--text text--darken-2">
              Remember your password? Sign in
            </nuxt-link>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { auth } from '~/plugins/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'

export default {
  layout: 'auth',
  data() {
    return {
      email: '',
      loading: false
    }
  },
  methods: {
    async sendResetLink() {
      this.loading = true
      try {
        await sendPasswordResetEmail(auth, this.email)
        this.$toast.success('Reset link sent successfully! Please check your email.')
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          this.$toast.error('No user found with this email.')
        } else if (error.code === 'auth/invalid-email') {
          this.$toast.error('Invalid email address.')
        } else {
          this.$toast.error(error.message || 'Failed to send reset link.')
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.light-bg {
  background: linear-gradient(to bottom, #f4f7fb, #ffffff);
}
</style>
