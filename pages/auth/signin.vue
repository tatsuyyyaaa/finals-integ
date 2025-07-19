<template>
  <v-container fluid class="fill-height d-flex align-center justify-center light-bg">
    <v-card class="pa-8 rounded-xl" max-width="480" elevation="6">
      <v-card-text>
        <div class="text-center mb-6">
          <v-icon size="48" color="blue darken-2">mdi-lock</v-icon>
          <h2 class="font-weight-bold mt-2">Welcome Back</h2>
          <p class="text-subtitle-1 text--secondary">Sign in to your account</p>
        </div>

        <v-form>
          <v-text-field
            v-model="name"
            label="Username"
            outlined
            dense
            rounded
            prepend-icon="mdi-account"
            class="mb-4"
          />

          <v-text-field
            v-model="email"
            label="Password"
            type="password"
            outlined
            dense
            rounded
            prepend-icon="mdi-lock"
            class="mb-4"
          />

          <v-btn color="blue darken-2" dark block rounded class="mb-4">
            Login
          </v-btn>

          <div class="text-center grey--text my-2">or</div>

          <v-btn color="red darken-1" dark @click="signinWithGoogle" block rounded>
            <v-icon left>mdi-google</v-icon> Sign in with Google
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  layout: 'auth',
  middleware: 'guest',
  data() {
    return {
      name: '',
      email: ''
    }
  },
  methods: {
    signinWithGoogle() {
      this.$auth.loginWith('google')
    }
  }
}
</script>

<style scoped>
.light-bg {
  background: linear-gradient(to bottom, #f9fafc, #eaeff5);
}
</style>
