// Generate or get a persistent user/session ID for evidence tracking
export function getUserId(): string {
  let userId = localStorage.getItem('ml-user-id');
  if (!userId) {
    userId = 'user-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('ml-user-id', userId);
  }
  return userId;
}
