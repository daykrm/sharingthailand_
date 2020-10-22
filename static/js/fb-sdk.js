window.fbAsyncInit = function () {
    FB.init({
      appId: '1453167908238102',
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v8.0'
    })
    FB.AppEvents.logPageView()
  };
  
  (function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0]
    if (d.getElementById(id)) { return }
    js = d.createElement(s); js.id = id
    js.src = 'https://connect.facebook.net/th_TH/sdk.js'
    fjs.parentNode.insertBefore(js, fjs)
  }(document, 'script', 'facebook-jssdk'))