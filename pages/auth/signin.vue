<template>
  <div class="d-flex align-center justify-center" style="height: 100vh;">
    <v-card width="500">
      <v-card-text>
        <h1 class="text-center my-8">Login Page</h1>
        <v-form>
          <v-text-field
            v-model="name"
            label="Username"
            rounded
            outlined
            prepend-icon="mdi-account"
          />
          <v-text-field
            v-model="email"
            label="Password"
            type="password"
            rounded
            outlined
            prepend-icon="mdi-lock"
          />
          <v-btn color="blue" rounded block>
            Login
          </v-btn>
          <div class="mx-3 my-3 d-flex align-center justify-center">OR</div>
          <v-btn color="green" @click="signinWithGoogle" class="text-capitalize" rounded block>
            <v-icon left>mdi-google</v-icon> Sign in With Google
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
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
