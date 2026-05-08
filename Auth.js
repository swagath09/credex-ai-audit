const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

function switchForm(){
    loginForm.classList.toggle('active');
    signupForm.classList.toggle('active');
}

signupForm.addEventListener('submit', function(e){

    e.preventDefault();

    const name = signupForm.querySelector('input[type="text"]').value;
    const email = signupForm.querySelector('input[type="email"]').value;
    const passwords = signupForm.querySelectorAll('input[type="password"]');

    const password = passwords[0].value;
    const confirmPassword = passwords[1].value;

    if(password !== confirmPassword){
        alert("Passwords do not match!");
        return;
    }

    const user = {
        name,
        email,
        password
    };

    localStorage.setItem("credexUser", JSON.stringify(user));

    alert("Account created successfully!");

    signupForm.reset();

    switchForm();

});

loginForm.addEventListener('submit', function(e){

    e.preventDefault();

    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    const storedUser = JSON.parse(localStorage.getItem("credexUser"));

    if(!storedUser){
        alert("No account found! Please create an account first.");
        switchForm();

        return;
    }

    if(
        email === storedUser.email &&
        password === storedUser.password
    ){

        localStorage.setItem(
            "loggedInUser",
            storedUser.name
        );

        alert("Login Successful!");

        window.location.href = "dashboard.html";

    }
    else{
        alert("Invalid Email or Password!");
    }

});
