<template>
  <v-container fluid class="fill-height d-flex align-center justify-center light-bg">
    <v-card class="pa-8 rounded-xl" max-width="500" elevation="6">
      <v-card-title class="justify-center">
        <div class="text-center w-100">
          <v-icon size="40" color="blue darken-2">mdi-account-plus</v-icon>
          <h2 class="font-weight-bold mt-2">Create Account</h2>
        </div>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="register">
          <v-text-field
            v-model="name"
            label="Full Name"
            prepend-icon="mdi-account"
            outlined
            dense
            rounded
            class="mb-4"
            required
          />

          <v-text-field
            v-model="email"
            label="Email"
            prepend-icon="mdi-email"
            outlined
            dense
            rounded
            class="mb-4"
            required
          />

          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append="showPassword = !showPassword"
            outlined
            dense
            rounded
            class="mb-4"
            required
          />

          <v-btn :loading="loading" type="submit" color="blue darken-2" dark block rounded>
            Register
          </v-btn>

          <div class="text-center mt-4">
            <nuxt-link to="/auth/signin" class="text-caption blue--text text--darken-2">
              Already have an account? Sign in
            </nuxt-link>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { auth } from '~/plugins/firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'

export default {
  layout: 'auth',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      showPassword: false,
      loading: false
    }
  },
  methods: {
    async register() {
      this.loading = true

      // Input validation
      if (!this.name || !this.email || !this.password) {
        this.$toast.error('Please fill in all required fields.')
        this.loading = false
        return
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password)
        await updateProfile(userCredential.user, { displayName: this.name })

        this.$toast.success('Account created successfully! Please log in.')
        this.$router.push('/auth/signin')
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          this.$toast.error('Email already in use.')
        } else if (error.code === 'auth/invalid-email') {
          this.$toast.error('Invalid email address.')
        } else if (error.code === 'auth/weak-password') {
          this.$toast.error('Password should be at least 6 characters.')
        } else {
          this.$toast.error(error.message || 'Registration failed.')
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
