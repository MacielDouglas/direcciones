let pingInterval = null;

export function startKeepAlive() {
  const SERVER_URL = import.meta.env.VITE_API_URL_SOCKET;
  if (pingInterval !== null) return;

  fetch(`${SERVER_URL}/ping`).catch(() => {});

  pingInterval = setInterval(() => {
    fetch(`${SERVER_URL}/ping`).catch(() => {});
  }, 14 * 60 * 1000); // A cada 14 minutos
}

export function stopKeepAlive() {
  if (pingInterval !== null) {
    clearInterval(pingInterval);
    pingInterval = null;
  }
}
