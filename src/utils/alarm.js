// Brew-complete alert: notification (if permitted), vibration and a short beep.
// Every step is best effort; none may throw into the timer.

export function requestNotificationPermission() {
  try {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  } catch { /* ignore */ }
}

export function fireBrewAlert() {
  try {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification("Keita's Kold Brew", { body: 'Your brew is done. Time to strain.', icon: '/icons/icon-192.png' });
    }
  } catch { /* ignore */ }
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([300, 150, 300, 150, 300]);
  } catch { /* ignore */ }
  try {
    const Ctx = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
    if (Ctx) {
      const ctx = new Ctx();
      [0, 0.4, 0.8].forEach((t) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 880;
        gain.gain.value = 0.2;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + t);
        osc.stop(ctx.currentTime + t + 0.25);
      });
    }
  } catch { /* ignore */ }
}
