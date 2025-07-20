import { auth } from '~/plugins/firebase'

export default function ({ redirect }) {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe()
      if (!user) {
        return redirect('/auth/signin')
      }
      resolve()
    })
  })
}
