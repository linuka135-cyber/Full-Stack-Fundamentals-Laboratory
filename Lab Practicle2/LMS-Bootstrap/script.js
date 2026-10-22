const hour = new Date().getHours();
let greeting;

if (hour < 12) {
    greeting = "Good Morning";
} else if (hour < 18) {
    greeting = "Good Afternoon";
} else {
    greeting = "Good Evening";
}

document.getElementById("greeting").textContent = greeting + "! Welcome to the LMS Platform";