<template>
  <v-container fluid class="fill-height d-flex align-center justify-center light-bg">
    <v-card class="pa-8 rounded-xl" max-width="460" elevation="6">
      <v-card-text>
        <!-- Header -->
        <div class="text-center mb-6">
          <v-icon size="48" color="blue darken-2">mdi-lock</v-icon>
          <h2 class="font-weight-bold mt-2">Welcome Back</h2>
          <p class="text-subtitle-1 text--secondary">Sign in to your account</p>
        </div>

        <!-- Login Form -->
        <v-form @submit.prevent="login">
          <v-text-field v-model="email" label="Email" prepend-icon="mdi-email" outlined dense rounded class="mb-4"
            :rules="[v => !!v || 'Email is required']" required />

          <v-text-field v-model="password" :type="showPassword ? 'text' : 'password'" label="Password"
            prepend-icon="mdi-lock" :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append="showPassword = !showPassword" outlined dense rounded class="mb-2"
            :rules="[v => !!v || 'Password is required']" required />

          <v-btn :loading="loading" type="submit" color="blue darken-2" dark block rounded large class="mb-4">
            Login
          </v-btn>

          <!-- Register / Forgot Password Links -->
          <div class="d-flex justify-space-between mb-6">
            <nuxt-link to="/auth/forgot-password" class="text-caption blue--text text--darken-2">
              Forgot Password?
            </nuxt-link>
            <nuxt-link to="/auth/register" class="text-caption blue--text text--darken-2">
              Register
            </nuxt-link>
          </div>

          <!-- Divider -->
          <v-divider class="mb-4"></v-divider>
          <p class="text-center grey--text text--caption mb-4">Or sign in with</p>

          <!-- Social Login Buttons -->
          <v-row dense>
            <v-col cols="6">
              <v-btn color="red darken-1" dark block rounded @click="signinWithGoogle">
                <v-icon left>mdi-google</v-icon> Google
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn color="indigo darken-4" dark block rounded @click="signinWithFacebook">
                <v-icon left>mdi-facebook</v-icon> Facebook
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '~/plugins/firebase'

export default {
  layout: 'auth',
  middleware: 'guest',
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      loading: false
    }
  },
  methods: {
    async login() {
      if (!this.email || !this.password) {
        this.$toast.error('Please enter both email and password.')
        return
      }

      this.loading = true
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password)
        this.$toast.success('Login successful! Redirecting...')

        // ✅ Hard redirect to index page to ensure Firebase state loads properly
        setTimeout(() => {
          window.location.href = '/'
        }, 1000)
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          this.$toast.error('User not found. Please register first.')
        } else if (error.code === 'auth/wrong-password') {
          this.$toast.error('Incorrect password.')
        } else {
          this.$toast.error(error.message || 'Login failed.')
        }
      } finally {
        this.loading = false
      }
    },
    signinWithGoogle() {
      this.$auth.loginWith('google')
    },
    signinWithFacebook() {
      this.$auth.loginWith('facebook')
    }
  }
}

</script>

<style scoped>
.light-bg {
  background: linear-gradient(to bottom, #f9fafc, #eaeff5);
}
</style>
