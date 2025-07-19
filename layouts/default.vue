<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar app color="white" flat>
      <v-toolbar-title class="font-weight-bold text--primary">
        <v-icon left color="blue darken-2">mdi-image-outline</v-icon>
        Smart Background Remover
      </v-toolbar-title>
      <v-spacer />
      <v-btn @click="$auth.logout()" color="blue darken-2" dark rounded>
        <v-icon left>mdi-logout</v-icon> Logout
      </v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="bg-grey lighten-5">
      <v-container class="fill-height d-flex align-center justify-center">
        <v-card
          elevation="2"
          class="pa-6"
          max-width="960"
          width="100%"
        >
          <Nuxt />
        </v-card>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer app color="white" class="justify-center">
      <span class="grey--text text--darken-1">&copy; {{ new Date().getFullYear() }} SmartBG</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  middleware: ['auth']
}
</script>

<style scoped>
.bg-grey {
  background-color: #f5f5f5 !important;
}
</style>
