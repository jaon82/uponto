// check for notifications support
// you can omit the 'window' keyword
if (window.webkitNotifications) {
  console.log("Notifications are supported!");
}
else {
  console.log("Notifications are not supported for this Browser/OS version yet.");
}

/*
document.querySelector('#show_button').addEventListener('click', function() {
  if (window.webkitNotifications.checkPermission() == 0) { // 0 is PERMISSION_ALLOWED
    // function defined in step 2
    window.webkitNotifications.createNotification(
        'icon.png', 'Notification Title', 'Notification content...');
  } else {
    window.webkitNotifications.requestPermission();
  }
}, false);
*/
