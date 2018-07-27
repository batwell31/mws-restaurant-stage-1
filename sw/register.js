document.addEventListener("DOMContentLoaded", event => {
    if (!navigator.serviceWorker) return;

    navigator.serviceWorker.register("/sw/index.js").then(registration => {
        console.log("Service Worker registered", registration)
    }).catch(e => {
        console.log("Registration failed", e)
    });        
});