import { useEffect, useState } from "react";

export const useSSE = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Cria uma nova instância do EventSource
    const eventSource = new EventSource(url, {
      withCredentials: true, // Inclui cookies (httpOnly)
    });

    // Escuta as mensagens do servidor
    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        setData(parsedData);
      } catch (err) {
        setError(err);
      }
    };

    // Escuta erros
    eventSource.onerror = (err) => {
      setError(err);
      eventSource.close();
    };

    // Fecha a conexão quando o componente é desmontado
    return () => {
      eventSource.close();
    };
  }, [url]);

  return { data, error };
};
