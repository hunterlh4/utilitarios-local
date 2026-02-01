export const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Utilitarios Local
      </h1>
      <p className="text-xl text-muted-foreground mb-8">
        Sistema de gestión local
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Rápido</h3>
          <p className="text-sm text-muted-foreground">
            Construido con Vite y React para máximo rendimiento
          </p>
        </div>
        <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Moderno</h3>
          <p className="text-sm text-muted-foreground">
            TypeScript, Tailwind CSS y ShadCN UI
          </p>
        </div>
        <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Escalable</h3>
          <p className="text-sm text-muted-foreground">
            Arquitectura modular y bien organizada
          </p>
        </div>
      </div>
    </div>
  );
};
