import { useState, useEffect } from "react";
import { Trash2, Sparkles } from "lucide-react";
import { useMetadata } from "../hooks/use-metadata";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { Switch } from "@/common/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/common/components/ui/dialog";
import type { Jav } from "../models/jav.model";
import { javService } from "../services/jav.service";
import { toast } from "sonner";

interface JavDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (jav: Jav) => void;
  editingJav: Jav | null;
}

export function JavDialog({ open, onOpenChange, onSave, editingJav }: JavDialogProps) {
  const [nombre, setNombre] = useState("");
  const [actriz, setActriz] = useState("");
  const [actrizUrl, setActrizUrl] = useState("");
  const [imagen, setImagen] = useState("");
  const [enlaces, setEnlaces] = useState<string[]>([""]);
  const [visto, setVisto] = useState(false);
  const [checkingCode, setCheckingCode] = useState(false);
  const [codeExists, setCodeExists] = useState(false);
  const { fetchMetadata, loading } = useMetadata();

  // Validar código automáticamente cuando tenga 7+ caracteres
  useEffect(() => {
    const checkCode = async () => {
      const codigoUpper = nombre.trim().toUpperCase();
      
      // Solo validar si tiene 7+ caracteres y no está editando el mismo JAV
      if (codigoUpper.length >= 7 && (!editingJav || editingJav.code !== codigoUpper)) {
        setCheckingCode(true);
        try {
          const exists = await javService.checkCodeExists(codigoUpper);
          setCodeExists(exists);
          if (exists) {
            toast.warning(`El código ${codigoUpper} ya existe en la base de datos`);
          }
        } catch (error) {
          console.error('Error al verificar código:', error);
        } finally {
          setCheckingCode(false);
        }
      } else {
        setCodeExists(false);
      }
    };

    // Debounce: esperar 500ms después de que el usuario deje de escribir
    const timeoutId = setTimeout(checkCode, 500);
    return () => clearTimeout(timeoutId);
  }, [nombre, editingJav]);

  useEffect(() => {
    if (editingJav) {
      setNombre(editingJav.code);
      setActriz(editingJav.actress?.name || "");
      setActrizUrl(""); // actressUrl no viene del backend, siempre vacío en edición
      setImagen(editingJav.image);
      // Convertir LinkDto[] a string[] para el formulario
      const enlacesUrls = editingJav.links && editingJav.links.length > 0 
        ? editingJav.links.map(link => link.url)
        : [];
      const enlacesConExtra = enlacesUrls.length > 0 
        ? (enlacesUrls.length < 5 ? [...enlacesUrls, ""] : enlacesUrls)
        : [""];
      setEnlaces(enlacesConExtra);
      setVisto(editingJav.status === 2);
    } else {
      setNombre("");
      setActriz("");
      setActrizUrl("");
      setImagen("");
      setEnlaces([""]);
      setVisto(false);
    }
  }, [editingJav, open]);

  const handleRemoveEnlace = (index: number) => {
    if (enlaces.length > 1) {
      setEnlaces(enlaces.filter((_, i) => i !== index));
    }
  };

  const handleEnlaceChange = (index: number, value: string) => {
    const newEnlaces = [...enlaces];
    newEnlaces[index] = value;
    setEnlaces(newEnlaces);
  };

  const handleEnlacePaste = (index: number, value: string, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault(); // Prevenir el pegado por defecto
    
    const newEnlaces = [...enlaces];
    newEnlaces[index] = value;
    setEnlaces(newEnlaces);
    
    // Si pegó un enlace y es el último campo, agregar uno nuevo automáticamente
    if (value.trim() && index === enlaces.length - 1 && enlaces.length < 8) {
      setTimeout(() => {
        setEnlaces((prev) => [...prev, ""]);
      }, 100);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombre.trim()) {
      alert("El código es obligatorio");
      return;
    }

    if (!imagen.trim()) {
      alert("La imagen es obligatoria");
      return;
    }

    // Filtrar enlaces vacíos ANTES de validar
    const enlacesFiltrados = enlaces.filter((enlace) => enlace.trim() !== "");

    if (enlacesFiltrados.length === 0) {
      alert("Al menos un enlace es obligatorio");
      return;
    }

    // Convertir string[] a LinkDto[] para enviar al backend
    const linksDto = enlacesFiltrados.map((url, index) => ({
      id: editingJav?.links?.[index]?.id || 0, // Mantener ID si existe
      url: url,
    }));

    const jav: Jav = {
      id: editingJav?.id || 0,
      code: nombre.trim().toUpperCase(),
      actressName: actriz.trim() || undefined,
      actressUrl: actrizUrl.trim() || undefined,
      image: imagen.trim(),
      links: linksDto,
      status: visto ? 2 : 1,
    };

    onSave(jav);
  };

  const handleClose = () => {
    onOpenChange(false);
    setNombre("");
    setActriz("");
    setActrizUrl("");
    setImagen("");
    setEnlaces([""]);
    setVisto(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingJav ? "Editar JAV" : "Agregar JAV"}</DialogTitle>
          <DialogDescription>
            {editingJav
              ? "Modifica los datos del JAV"
              : "Completa los datos para agregar un nuevo JAV"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">
              Código <span className="text-red-500">*</span>
              {checkingCode && <span className="text-xs text-muted-foreground ml-2">Verificando...</span>}
              {codeExists && <span className="text-xs text-red-500 ml-2">⚠️ Ya existe</span>}
            </Label>
            <Input
              id="nombre"
              placeholder="Código del JAV (ej: SSIS-123)"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className={`focus-visible:ring-0 focus-visible:ring-offset-0 ${codeExists ? 'border-red-500' : ''}`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="actriz">Actriz</Label>
            <Input
              id="actriz"
              placeholder="Nombre de la actriz"
              value={actriz}
              onChange={(e) => setActriz(e.target.value)}
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="actrizUrl">URL de la Actriz</Label>
            <Input
              id="actrizUrl"
              type="url"
              placeholder="https://example.com/actriz"
              value={actrizUrl}
              onChange={(e) => setActrizUrl(e.target.value)}
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imagen">
              URL de Imagen <span className="text-red-500">*</span>
            </Label>
            <Input
              id="imagen"
              type="url"
              placeholder="https://example.com/imagen.jpg"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
              required
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="space-y-2">
            <Label>
              Enlaces <span className="text-red-500">* (mínimo 1)</span>
            </Label>
            {enlaces.map((enlace, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="url"
                  placeholder={`Enlace ${index + 1}`}
                  value={enlace}
                  onChange={(e) => handleEnlaceChange(index, e.target.value)}
                  onPaste={(e) => {
                    const pastedText = e.clipboardData.getData('text');
                    handleEnlacePaste(index, pastedText, e);
                  }}
                  data-enlace-index={index}
                  required={index === 0}
                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button
                  type="button"
                  size="icon"
                  disabled={loading || !enlace.trim()}
                  onClick={async () => {
                    const urlToFetch = enlace;
                    if (!urlToFetch) return;
                    
                    const metadata = await fetchMetadata(urlToFetch);
                    
                    if (metadata) {
                      // Verificar si ya existe un JAV con ese código
                      const codigoUpper = metadata.nombre.trim().toUpperCase();
                      
                      // Si está editando, permitir el mismo código
                      if (editingJav && editingJav.code === codigoUpper) {
                        // Es el mismo JAV que está editando, permitir
                        setNombre(metadata.nombre);
                        if (metadata.actriz) {
                          setActriz(metadata.actriz);
                        }
                        setImagen(metadata.imagen);
                        const nuevosEnlaces = [...enlaces];
                        nuevosEnlaces[index] = metadata.enlace;
                        setEnlaces(nuevosEnlaces);
                        setVisto(false);
                        return;
                      }
                      
                      // TODO: Verificar en el backend si ya existe el código
                      // Por ahora solo cargamos los datos
                      
                      // Si no existe, cargar los datos
                      setNombre(metadata.nombre);
                      if (metadata.actriz) {
                        setActriz(metadata.actriz);
                      }
                      setImagen(metadata.imagen);
                      // Actualizar el enlace del índice clickeado
                      const nuevosEnlaces = [...enlaces];
                      nuevosEnlaces[index] = metadata.enlace;
                      setEnlaces(nuevosEnlaces);
                      setVisto(false);
                    } else {
                      console.log('❌ No se pudo obtener metadata');
                    }
                  }}
                >
                  {loading ? "..." : <Sparkles className="w-4 h-4" />}
                </Button>
                {enlaces.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveEnlace(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              {editingJav ? "Guardar" : "Agregar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
