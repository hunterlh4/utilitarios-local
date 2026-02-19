import { useState } from 'react';
import { Button } from '@/common/components/ui/button';
import { Textarea } from '@/common/components/ui/textarea';
import { Trash2 } from 'lucide-react';

interface Resources {
  metal: number;
  crystal: number;
  deuterium: number;
}

export const OGamePage = () => {
  const [planets, setPlanets] = useState<string[]>(['']);

  const parseResources = (text: string): Resources => {
    // Dividir por saltos de línea para obtener los 3 recursos
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    
    const parseValue = (str: string): number => {
      if (!str) return 0;
      
      // Remover espacios
      str = str.trim();
      
      // Si contiene M, es millones
      if (str.includes('M')) {
        // Extraer el número antes de M: "2,916M" o "14,134M" o "214,551M"
        // La coma es separador de miles, así que: 2,916 = 2.916
        const numStr = str.replace('M', '').replace(',', '.');
        const num = parseFloat(numStr);
        return num * 1_000_000;
      }
      
      // Si contiene K, es miles
      if (str.includes('K')) {
        const numStr = str.replace('K', '').replace(',', '.');
        const num = parseFloat(numStr);
        return num * 1_000;
      }
      
      // Si no tiene letra, el formato es: 39.022 o 102.095 o 621.182
      // El punto es separador decimal, así que 102.095 = 102 mil 95
      // Solo tomar la parte entera (antes del punto) como miles
      const parts = str.split('.');
      const thousands = parseInt(parts[0]) || 0;
      return thousands * 1_000;
    };

    let metal = 0, crystal = 0, deuterium = 0;
    
    if (lines.length >= 3) {
      // Formato de 3 líneas
      metal = parseValue(lines[0]);
      crystal = parseValue(lines[1]);
      deuterium = parseValue(lines[2]);
    } else if (lines.length === 1) {
      // Formato en una línea: "102.095621.18214,551M"
      const line = lines[0];
      
      // Buscar todas las posiciones de números seguidos de M
      const mMatches = [...line.matchAll(/(\d+[,.]?\d*M)/g)];
      
      if (mMatches.length > 0) {
        // Dividir por las M encontradas
        let remaining = line;
        const values: string[] = [];
        
        for (const match of mMatches) {
          const mIndex = remaining.indexOf(match[0]);
          if (mIndex > 0) {
            // Hay algo antes de esta M
            values.push(remaining.substring(0, mIndex));
          }
          values.push(match[0]);
          remaining = remaining.substring(mIndex + match[0].length);
        }
        
        // Si queda algo al final
        if (remaining) {
          values.push(remaining);
        }
        
        // Asignar valores
        if (values.length >= 3) {
          metal = parseValue(values[0]);
          crystal = parseValue(values[1]);
          deuterium = parseValue(values[2]);
        } else if (values.length === 2) {
          metal = parseValue(values[0]);
          deuterium = parseValue(values[1]);
        }
      } else {
        // No hay M, intentar dividir por puntos
        const parts = line.split('.');
        if (parts.length >= 3) {
          metal = parseValue(parts[0]);
          crystal = parseValue(parts[1]);
          deuterium = parseValue(parts[2]);
        }
      }
    }

    return { metal, crystal, deuterium };
  };

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) {
      const millions = num / 1_000_000;
      // Separar millones y miles: 2.916M → 2M 916K
      const m = Math.floor(millions);
      const k = Math.floor((millions - m) * 1000);
      if (k > 0) {
        return `${m}M ${k}K`;
      }
      return `${m}M`;
    } else if (num >= 1_000) {
      const thousands = Math.floor(num / 1_000);
      return `${thousands}K`;
    }
    return Math.floor(num).toString();
  };

  const formatTotal = (num: number): string => {
    if (num >= 1_000_000) {
      const millions = num / 1_000_000;
      return `${millions.toFixed(3).replace(/\.?0+$/, '')}M`;
    } else if (num >= 1_000) {
      const thousands = num / 1_000;
      return `${thousands.toFixed(3).replace(/\.?0+$/, '')}K`;
    }
    return Math.floor(num).toString();
  };

  const generateBuildingCosts = (type: string, startLevel: number, endLevel: number) => {
    const costs = [];
    
    for (let level = startLevel; level <= endLevel; level++) {
      let metal = 0, crystal = 0, deuterium = 0;
      
      switch (type) {
        case 'metal':
          metal = Math.floor(60 * Math.pow(1.5, level - 1));
          crystal = Math.floor(15 * Math.pow(1.5, level - 1));
          break;
        case 'crystal':
          metal = Math.floor(48 * Math.pow(1.6, level - 1));
          crystal = Math.floor(24 * Math.pow(1.6, level - 1));
          break;
        case 'deuterium':
          metal = Math.floor(225 * Math.pow(1.5, level - 1));
          crystal = Math.floor(75 * Math.pow(1.5, level - 1));
          break;
        case 'solar':
          metal = Math.floor(75 * Math.pow(1.5, level - 1));
          crystal = Math.floor(30 * Math.pow(1.5, level - 1));
          break;
        case 'fusion':
          metal = Math.floor(900 * Math.pow(1.8, level - 1));
          crystal = Math.floor(360 * Math.pow(1.8, level - 1));
          deuterium = Math.floor(180 * Math.pow(1.8, level - 1));
          break;
      }
      
      costs.push({ level, metal, crystal, deuterium });
    }
    
    return costs;
  };

  const calculateTotal = (): Resources => {
    return planets.reduce((total, planet) => {
      const resources = parseResources(planet);
      return {
        metal: total.metal + resources.metal,
        crystal: total.crystal + resources.crystal,
        deuterium: total.deuterium + resources.deuterium,
      };
    }, { metal: 0, crystal: 0, deuterium: 0 });
  };

  const addPlanet = () => {
    setPlanets([...planets, '']);
  };

  const removePlanet = (index: number) => {
    setPlanets(planets.filter((_, i) => i !== index));
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>, index: number) => {
    // No hacer nada especial, dejar que el paste normal funcione
    // El textarea manejará los saltos de línea automáticamente
  };

  const updatePlanet = (index: number, value: string) => {
    const newPlanets = [...planets];
    newPlanets[index] = value;
    setPlanets(newPlanets);
    
    // Contar líneas en el valor actual
    const lines = value.split('\n').filter(l => l.trim());
    
    // Si tiene 3 líneas y es el último input, crear uno nuevo
    if (lines.length >= 3 && index === planets.length - 1) {
      setPlanets([...newPlanets, '']);
    }
  };

  const total = calculateTotal();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">OGame - Calculadora de Recursos</h1>
        <p className="text-muted-foreground mt-2">
          Pega los recursos de cada planeta en formato: Metal,Cristal,Deuterio
        </p>
        <p className="text-sm text-muted-foreground">
          Ejemplo: 64.125605.26214,547M o 2,916M39.02214,134M
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {planets.map((planet, index) => (
          <div key={index} className="flex gap-1 items-start">
            <Textarea
              value={planet}
              onChange={(e) => updatePlanet(index, e.target.value)}
              onPaste={(e) => handlePaste(e, index)}
              placeholder={`P${index + 1}`}
              className="w-32 h-20 font-mono text-xs resize-none"
              rows={3}
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => removePlanet(index)}
              disabled={planets.length === 1}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      <div className="bg-muted p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-background p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Metal</div>
            <div className="text-2xl font-bold text-blue-600">
              {formatTotal(total.metal)}
            </div>
          </div>
          <div className="bg-background p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Cristal</div>
            <div className="text-2xl font-bold text-green-600">
              {formatTotal(total.crystal)}
            </div>
          </div>
          <div className="bg-background p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Deuterio</div>
            <div className="text-2xl font-bold text-cyan-600">
              {formatTotal(total.deuterium)}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Costos de Construcción</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Mina de Metal */}
          <div className="bg-background p-3 rounded-lg">
            <h4 className="font-medium text-blue-600 mb-2">Mina de Metal (35+)</h4>
            <div className="space-y-1 text-sm">
              {generateBuildingCosts('metal', 35, 40).map((cost) => {
                const canBuild = total.metal >= cost.metal && total.crystal >= cost.crystal;
                return (
                  <div 
                    key={cost.level} 
                    className={`flex justify-between ${canBuild ? 'text-green-600 font-semibold' : ''}`}
                  >
                    <span>Nivel {cost.level}:</span>
                    <span className="font-mono">{formatTotal(cost.metal)}M / {formatTotal(cost.crystal)}C</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mina de Cristal */}
          <div className="bg-background p-3 rounded-lg">
            <h4 className="font-medium text-green-600 mb-2">Mina de Cristal (32+)</h4>
            <div className="space-y-1 text-sm">
              {generateBuildingCosts('crystal', 32, 37).map((cost) => {
                const canBuild = total.metal >= cost.metal && total.crystal >= cost.crystal;
                return (
                  <div 
                    key={cost.level} 
                    className={`flex justify-between ${canBuild ? 'text-green-600 font-semibold' : ''}`}
                  >
                    <span>Nivel {cost.level}:</span>
                    <span className="font-mono">{formatTotal(cost.metal)}M / {formatTotal(cost.crystal)}C</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sintetizador de Deuterio */}
          <div className="bg-background p-3 rounded-lg">
            <h4 className="font-medium text-cyan-600 mb-2">Sintetizador (30+)</h4>
            <div className="space-y-1 text-sm">
              {generateBuildingCosts('deuterium', 30, 35).map((cost) => {
                const canBuild = total.metal >= cost.metal && total.crystal >= cost.crystal;
                return (
                  <div 
                    key={cost.level} 
                    className={`flex justify-between ${canBuild ? 'text-green-600 font-semibold' : ''}`}
                  >
                    <span>Nivel {cost.level}:</span>
                    <span className="font-mono">{formatTotal(cost.metal)}M / {formatTotal(cost.crystal)}C</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Planta de Energía Solar */}
          <div className="bg-background p-3 rounded-lg">
            <h4 className="font-medium text-yellow-600 mb-2">Planta Solar (34+)</h4>
            <div className="space-y-1 text-sm">
              {generateBuildingCosts('solar', 34, 39).map((cost) => {
                const canBuild = total.metal >= cost.metal && total.crystal >= cost.crystal;
                return (
                  <div 
                    key={cost.level} 
                    className={`flex justify-between ${canBuild ? 'text-green-600 font-semibold' : ''}`}
                  >
                    <span>Nivel {cost.level}:</span>
                    <span className="font-mono">{formatTotal(cost.metal)}M / {formatTotal(cost.crystal)}C</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Planta de Fusión - Más ancha */}
          <div className="bg-background p-3 rounded-lg md:col-span-2">
            <h4 className="font-medium text-purple-600 mb-2">Planta Fusión (15+)</h4>
            <div className="space-y-1 text-sm">
              {generateBuildingCosts('fusion', 15, 20).map((cost) => {
                const canBuild = total.metal >= cost.metal && total.crystal >= cost.crystal && total.deuterium >= cost.deuterium;
                return (
                  <div 
                    key={cost.level} 
                    className={`flex justify-between ${canBuild ? 'text-green-600 font-semibold' : ''}`}
                  >
                    <span>Nivel {cost.level}:</span>
                    <span className="font-mono">{formatTotal(cost.metal)}M / {formatTotal(cost.crystal)}C / {formatTotal(cost.deuterium)}D</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
