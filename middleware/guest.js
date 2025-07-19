export default function ({ $auth, route, redirect }) {
  // Let the Google login callback route finish
  if (route.path.startsWith('/auth/callback')) return

  // If already logged in, redirect to home
  if ($auth.loggedIn) {
    return redirect('/')
  }
}
