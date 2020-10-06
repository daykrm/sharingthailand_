export default function ({ store, redirect }) {
  const Cookie = process.client ? require('js-cookie') : undefined
  // If the user is not authenticated
  let token = Cookie.get('isAdmin')
  const userIsLoggedIn = token != null //cookie ada
  //   const userNeedLogin = token == null //cookie gak ada
  //   if (userNeedLogin) {
  //     return redirect('/login').catch(()=>{})
  //   }
  if (userIsLoggedIn) {
    if (token != 1) {
      return redirect('/login')
    }
  }
}
