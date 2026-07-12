// Obtiene el martes de esta semana (el último martes que ya pasó)
export const getThisTuesday = (): Date => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = domingo, 1 = lunes, 2 = martes, etc.
  
  // Calcular cuántos días hay que restar para llegar al martes (día 2)
  let daysFromTuesday = dayOfWeek - 2;
  
  // Si hoy es domingo (0) o lunes (1), ir al martes de la semana anterior
  if (dayOfWeek === 0) {
    daysFromTuesday = 5; // domingo - 5 días = martes anterior
  } else if (dayOfWeek === 1) {
    daysFromTuesday = 6; // lunes - 6 días = martes anterior
  }
  
  const tuesday = new Date(today);
  tuesday.setDate(today.getDate() - daysFromTuesday);
  tuesday.setHours(0, 0, 0, 0); // Poner a medianoche
  
  return tuesday;
};

// Determina el color del borde basado en LastPlay
// Verde: ya se jugó esta semana (lastPlay >= martes actual)
// null: sin color (no se ha jugado o es de semana anterior)
export const getLastPlayStatus = (lastPlay?: string): 'green' | null => {
  if (!lastPlay) return null;
  
  const lastPlayDate = new Date(lastPlay);
  const thisTuesday = getThisTuesday();
  
  // Solo devuelve verde si ya se jugó esta semana
  return lastPlayDate >= thisTuesday ? 'green' : null;
};
