// check if you need the logout button
window.onload = userNav();

function userNav(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('user logged in');
      $(".nav").removeClass("hide");
    }
  });
}
