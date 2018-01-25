  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAdkSaJem8XFuk6yjFaJbKHOJoNXkKhS3I",
    authDomain: "moodify-9f3d9.firebaseapp.com",
    databaseURL: "https://moodify-9f3d9.firebaseio.com",
    projectId: "moodify-9f3d9",
    storageBucket: "moodify-9f3d9.appspot.com",
    messagingSenderId: "1070794739398"
  };
  firebase.initializeApp(config);

    var database = firebase.database();

// declare variables
var error=false;
var txtMood="";
var txtName="";
var txtEmail="";
var txtPassword="";
var txtZipCode=0;
var modalTimeout=3000;

// Launch modal after a set amount of time
var modalPop = setTimeout(showModal, modalTimeout);

// change color of mood selection when hovered
$(".txtMood").hover(function(){
  $(this).css("background-color", "grey");
  }, function(){
  $(this).css("background-color", "white");
});

// hide mood div and submit button on modal launch
$("#signUpLogIn").on("click", function(){;
  $("#btnSignUpSubmit").hide();
  $("#btnLogInSubmit").hide();
  $("#moodDiv").hide();
  clearTimeout(modalPop);
});



// function to show modal
function showModal(){
    $('#myModal').modal('show');
    $("#btnSignUpSubmit").hide();
    $("#btnLogInSubmit").hide();
    $("#moodDiv").hide();
    console.log("test");
  }


// set values for verification on pressing verify button
$("#btnSignUpVerify").on("click",function(){
  txtName=$("#txtName").val();
  txtEmail=$("#txtEmail").val();
  txtPassword=$("#txtPassword").val();
  txtZipCode=$("#txtZipCode").val();
  signUpValidation();
})

// check user input
function signUpValidation(){
  $("#inputValidationMessageSU").html("");

  // validate that name field is filled
  var nameCheck=txtName.split("");
  if (nameCheck.length===0){
    $("#txtName").val("");
    $("#inputValidationMessageSU").append("Please input a valid name"+"<br>");
  }

  // validate that email field has "@" and ".com"
  var emailCheckAt=txtEmail.includes("@");
  var emailCheckDotCom=txtEmail.includes(".com");
  if(emailCheckAt==false || emailCheckDotCom==false){
    $("#txtEmail").val("");
    $("#inputValidationMessageSU").append("Please input a valid email addess"+"<br>");
  }

  // validate that password field is filled
  var passwordCheck=txtPassword.split("");
  if (passwordCheck.length===0){
    $("#txtPassword").val("");
    $("#inputValidationMessageSU").append("Please input a valid password"+"<br>");
  }

  // validate that zipcode field is composed of numbers
  var zipCodeCheck=txtZipCode.split("");
  var zipCodeCheckBoolean=(isNaN(txtZipCode));
  if(isNaN(txtZipCode) || zipCodeCheck.length===0){
    $("#txtZipCode").val("");
    $("#inputValidationMessageSU").append("Please input a valid zip code"+"<br>");
 }

 // if validation all passes hide the verify button and show submit button
 if (nameCheck.length>0 && emailCheckAt==true && emailCheckDotCom==true && passwordCheck.length>0 && zipCodeCheckBoolean==false && zipCodeCheck.length>0){
  $("#btnSignUpVerify").hide();
  $("#btnSignUpSubmit").show();
 }
}

// on sign up submission save inputs and sent to firebase to save new user
$("#btnSignUpSubmit").on("click", function(){
  txtName=$("#txtName").val();
  txtEmail=$("#txtEmail").val();
  txtPassword=$("#txtPassword").val();
  txtZipCode=$("#txtZipCode").val();
  console.log(txtName);
  console.log(txtEmail);
  console.log(txtPassword);
  console.log(txtZipCode);
  console.log(txtMood);
  var email=txtEmail;
  var password=txtPassword;

  //create data object to send to firebase
  var data = {
    name: txtName,
    zipCodeCheck: txtZipCode,
    mood: txtMood,
  };


  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(user){
      console.log(user);

      // On user sign up push user data to firebase under data
      firebase.database().ref("/users/"+user.uid).child("/data").push(data);
    })
    .catch(function(err){
      console.log(err);
    });

})

// log in validation function
function logInValidation(){
  $("#inputValidationMessageLI").html("");

  // validate that email field has "@" and ".com"
  var emailCheckAt=txtEmail.includes("@");
  var emailCheckDotCom=txtEmail.includes(".com");
  if(emailCheckAt==false || emailCheckDotCom==false){
    $("#txtEmailLogIn").val("");
    $("#inputValidationMessageLI").append("Please input a valid email addess"+"<br>");
  }

  // validate that password field is filled
  var passwordCheck=txtPassword.split("");
  if (passwordCheck.length===0){
    $("#txtPasswordLogIn").val("");
    $("#inputValidationMessageLI").append("Please input a valid password"+"<br>");
  }

 // if validation all passes hide the verify button and show submit button
 if (emailCheckAt==true && emailCheckDotCom==true && passwordCheck.length>0){
  $("#btnLogInVerify").hide();
  $("#btnLogInSubmit").show();
 }
}

// when log in verification button is pressed run validation function
$("#btnLogInVerify").on("click", function(){
  txtEmail=$("#txtEmailLogIn").val();
  txtPassword=$("#txtPasswordLogIn").val();
  logInValidation();
})

// on log in submit save input values to compare the firebase
$("#btnLogInSubmit").on("click", function(){
  txtEmail=$("#txtEmailLogIn").val();
  txtPassword=$("#txtPasswordLogIn").val();
  console.log(txtEmail);
  console.log(txtPassword);
  console.log(txtMood);
  var email=txtEmail;
  var password=txtPassword;

  // firebase log in
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(user){
      console.log(user);
      error=false;
    })
    .catch(function(err){
      console.log(err);
      error=true;
      $("#btnLogInSubmit").hide();
      $("#btnLogInVerify").show();
      $("#inputValidationMessageLI").html("Email/Password incorrect");

    });

});

// if user is already signed in bypass landing page and go directly to user page
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log(user);
    window.location.href="userpro.html";
   
  } else {
    console.log("nobody signed in");
  }
});



