
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/index.js', {scope: "/js/sw/"}).then(reg => {
        console.log('Service Worker registration was successful: ' + reg.scope);
    }).catch(error => {
        console.log('Service Worker registration has failed: ' + error);
    });
}else {
    return;
}
