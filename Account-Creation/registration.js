// Form Blur Event Listeners --> When we step away, blur occurs.
document.getElementById('name').addEventListener('blur', validateName);
document.getElementById('InputPassword').addEventListener('blur', validatePass);
document.getElementById('userName').addEventListener('blur', validateUsername);
document.getElementById('submitBtn').addEventListener('click', checkSubmit);

function validateUsername(){
  const username = document.getElementById('userName');
  const nameExpr = /^[a-zA-Z]{2,10}$/;

  if(!nameExpr.test(username.value)){
    username.classList.add('is-invalid');
  } else {
    username.classList.remove('is-invalid');
  }
}

function validateName() {
  const name = document.getElementById('name');
  const nameExpr = /^([a-zA-Z]{2,20} [a-zA-Z]{1,20})$/;

  if(!nameExpr.test(name.value)){
    name.classList.add('is-invalid');
  } else {
    name.classList.remove('is-invalid');
  }
}

function validatePass() {
  const pass = document.getElementById('InputPassword');
  const passExpr = /^[a-zA-Z\d]{2,20}$/;

  if(!passExpr.test(pass.value)){
    pass.classList.add('is-invalid');
  } else {
    pass.classList.remove('is-invalid');
  }
}

function checkSubmit(e){
  e.preventDefault()
  const name = document.getElementById('name').value;
  const pass = document.getElementById('InputPassword').value;
  const user = document.getElementById('userName').value;


  if(name == '' || user == '' || pass == ''){
    // GIVE AN ALERT
    const div = document.createElement('div');
    div.className = "alert error";
    div.appendChild(document.createTextNode('Please fill out all required fields!'));
    const container = document.querySelector('.container');
    const form = document.querySelector('.hello');

    container.insertBefore(div, form);
    setTimeout(function(){
      document.querySelector('.alert').remove();
    }, 5000);
  }
  else{
    // everything is filled out, go to next page depending on if manager or not
    signUp();
  }
}

/*-=+=-=+=-=+=-=+=-=+=-=+=-=+=-=+=-
  CREATE USER WITH USERNAME AND PASS
-=+=-=+=-=+=-=+=-=+=-=+=-=+=-=+=-*/

function signUp() {
  //Get elements
  const name = document.getElementById('name').value;
  const user = document.getElementById('userName').value;
  const pass = document.getElementById('InputPassword').value;
  const auth = firebase.auth();
  // SignUp with the user and pass
  const promise = auth.createUserWithEmailAndPassword(user+'@savaria.com', pass);
  promise.catch(e => window.alert(e.message));
  signUptimeout();
}

// Signup Timer
function signUptimeout() {
  var timer = setTimeout(confirmedSignUp, 1000);
}

// Get the currently signed-in user
function confirmedSignUp(){
  // will create an observable to see when the state of the current user changes
  firebase.auth().onAuthStateChanged(firebaseUser =>{
  if(firebaseUser) {
    // check if the radio button has been clicked
    var checkBox = document.getElementById("managerCheck");
    if(checkBox.checked == true){
      // Create a Manager -- redirect after user created
      createManager();
    }
    else{
      // Create an Employee -- redirect after employee created
      createEmployee();
    }
  } else {
    //Error Alert
  //  window.alert('Error, Sign Up Not Successful. Try Again.');
  }
  });
}

/*-=+=-=+=-=+=-=+=-=+=-=+=-=+=-=+=-
        ACCOUNT CREATION
-=+=-=+=-=+=-=+=-=+=-=+=-=+=-=+=-*/

// Create an Employee
function createEmployee(){
  // want to store Full Name, Username, Manager Status, Activity Log
  var fullName = document.getElementById('name');
  var userName = document.getElementById('userName');
  var empRef = firebase.database().ref('Employees'); // reference to our collection

  // save to firebase database
  empRef.child(userName.value).set({
    fullName: fullName.value,
    manager: false,
  })
  .then(function(){
    window.open("./EmployeeReg.html", "_self");
  });

}

// Create a Manager
function createManager(){
  // want to store Full Name, Username, Manager Status, Activity Log
  var fullName = document.getElementById('name');
  var userName = document.getElementById('userName');
  var empRef = firebase.database().ref('Employees'); // reference to our collection

  // save to firebase database
  empRef.child(userName.value).set({
    fullName: fullName.value,
    manager: true,
  })
  .then(function(){
    window.open("./managerReg.html", "_self");
  });
}
