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

          <!-- Social Login Buttons Row -->
          <v-row dense class="mt-4">
            <v-col cols="6">
              <v-btn color="red darken-1" dark block rounded @click="signinWithGoogle">
                <v-icon left>mdi-google</v-icon>
                Google
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn color="indigo darken-4" dark block rounded @click="signinWithFacebook">
                <v-icon left>mdi-facebook</v-icon>
                Facebook
              </v-btn>
            </v-col>
          </v-row>
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
    },
    signinWithFacebook() {
      this.$auth.loginWith('facebook')
    }
  }
}
</script>
