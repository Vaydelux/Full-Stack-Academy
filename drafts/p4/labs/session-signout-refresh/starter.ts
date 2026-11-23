// Clearing local UI state alone leaves refresh sessions elsewhere intact.
localStorage.removeItem("isSignedIn");
setIsSignedIn(false);
