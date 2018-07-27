document.addEventListener("DOMContentLoaded", event => {
    if (!navigator.serviceWorker) return;

    navigator.serviceWorker.register("/sw/index.js").then(registration =>
        console.log("Registration of the Service Worker is complete!", registration)
    ).catch(e =>
        console.log("The Service Worker has failed to register.", e)
    );        
});