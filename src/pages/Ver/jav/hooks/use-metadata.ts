import { useState } from "react";
import { apiClient } from "@/config/api/api-client";

interface MetadataResponse {
  status: string;
  data: {
    title: string;
    description?: string;
    image: {
      url: string;
    } | null;
    url: string;
  };
}

export function useMetadata() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetadata = async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      const result: any = await apiClient.get('/metadata', {
        params: { url }
      });

      // El interceptor ya devuelve response.data, así que result es directamente la respuesta
      const data = result.data;

      // Extraer el código del título (ej: "JUFE-459" de "JUFE-459 Unconsciously...")
      const titleMatch = data.title.match(/^([A-Z]+-\d+)/);
      const codigo = titleMatch ? titleMatch[1] : "";

      // Extraer el nombre de la actriz de la descripción
      let actriz = "";
      if (data.description) {
        // Buscar "Starring By:" o "Starring:"
        const starringMatch = data.description.match(/Starring(?:\s+By)?:\s*([^.]+?)(?:\s+In\s+HD|\.|$)/i);
        if (starringMatch) {
          actriz = starringMatch[1].trim();
        }
      }

      // Si no hay imagen, devolver string vacío para que el usuario lo complete manualmente
      const imagenUrl = data.image?.url || "";

      return {
        nombre: codigo,
        actriz: actriz || undefined,
        imagen: imagenUrl,
        enlace: url,
        sinImagen: !data.image || !data.image.url,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchMetadata, loading, error };
}
