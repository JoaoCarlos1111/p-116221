
import React, { useState } from 'react';

interface EstadoData {
  estado: string;
  notificacoes: number;
  acordos: number;
  desativacoes: number;
}

interface BrazilInteractiveMapProps {
  estadosRanking: EstadoData[];
}

interface TooltipData {
  estado: string;
  notificacoes: number;
  acordos: number;
  desativacoes: number;
  x: number;
  y: number;
}

const BrazilInteractiveMap: React.FC<BrazilInteractiveMapProps> = ({ estadosRanking }) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  // Converter array para objeto para facilitar o acesso
  const estadosData = estadosRanking.reduce((acc, estado) => {
    acc[estado.estado] = estado;
    return acc;
  }, {} as Record<string, EstadoData>);

  // Definindo formas específicas dos estados com paths SVG mais precisos
  const statePaths: { [key: string]: string } = {
    // Região Norte
    'AM': "M120,120 L160,110 L195,125 L220,140 L240,160 L235,185 L220,200 L195,210 L170,205 L145,195 L125,180 L115,155 L120,120 Z",
    'RR': "M160,45 L190,40 L210,50 L215,65 L210,80 L190,85 L170,85 L155,75 L150,60 L160,45 Z",
    'AP': "M245,55 L270,50 L285,60 L290,75 L285,90 L270,95 L255,95 L245,85 L240,70 L245,55 Z",
    'PA': "M195,75 L235,70 L270,80 L290,95 L285,120 L275,140 L255,145 L235,140 L215,130 L200,115 L190,95 L195,75 Z",
    'TO': "M235,125 L260,120 L275,135 L280,150 L275,170 L265,180 L250,185 L235,180 L230,165 L230,145 L235,125 Z",
    'RO': "M140,145 L170,140 L185,155 L190,170 L185,185 L170,190 L155,190 L140,185 L135,170 L135,155 L140,145 Z",
    'AC': "M95,145 L125,140 L140,155 L145,170 L140,185 L125,190 L110,190 L95,185 L90,170 L90,155 L95,145 Z",
    
    // Região Nordeste
    'MA': "M275,95 L305,90 L325,105 L330,120 L325,135 L305,140 L285,140 L275,125 L270,110 L275,95 Z",
    'PI': "M295,135 L320,130 L335,145 L340,160 L335,175 L320,180 L305,180 L295,165 L290,150 L295,135 Z",
    'CE': "M335,105 L365,100 L380,115 L385,130 L380,145 L365,150 L350,150 L335,135 L330,120 L335,105 Z",
    'RN': "M365,110 L385,105 L395,120 L400,135 L395,150 L385,155 L375,155 L365,140 L360,125 L365,110 Z",
    'PB': "M375,130 L390,125 L400,140 L405,155 L400,170 L390,175 L380,175 L375,160 L370,145 L375,130 Z",
    'PE': "M355,145 L380,140 L395,155 L400,170 L395,185 L380,190 L365,190 L355,175 L350,160 L355,145 Z",
    'AL': "M370,170 L385,165 L395,180 L400,195 L395,210 L385,215 L375,215 L370,200 L365,185 L370,170 Z",
    'SE': "M355,185 L375,180 L385,195 L390,210 L385,225 L375,230 L365,230 L355,215 L350,200 L355,185 Z",
    'BA': "M305,155 L345,150 L365,165 L375,180 L370,205 L365,230 L350,245 L330,250 L310,245 L295,230 L290,205 L295,180 L305,155 Z",
    
    // Região Centro-Oeste
    'MT': "M175,185 L215,180 L240,195 L250,210 L245,235 L235,255 L220,265 L200,260 L180,250 L165,235 L160,210 L170,190 L175,185 Z",
    'MS': "M205,245 L230,240 L245,255 L250,270 L245,290 L235,305 L220,310 L205,305 L195,290 L190,275 L195,260 L205,245 Z",
    'GO': "M235,205 L270,200 L290,215 L300,230 L295,250 L285,265 L270,270 L255,265 L240,250 L230,235 L230,220 L235,205 Z",
    'DF': "M250,220 L265,215 L275,230 L280,245 L275,260 L265,265 L255,265 L250,250 L245,235 L250,220 Z",
    
    // Região Sudeste
    'MG': "M285,235 L320,230 L345,245 L355,260 L350,285 L340,305 L325,315 L305,315 L285,305 L270,290 L265,270 L270,250 L285,235 Z",
    'ES': "M335,255 L355,250 L365,265 L370,280 L365,295 L355,305 L345,305 L335,290 L330,275 L335,255 Z",
    'RJ': "M325,285 L345,280 L360,295 L365,310 L360,325 L345,335 L330,335 L325,320 L320,305 L320,295 L325,285 Z",
    'SP': "M275,295 L310,290 L330,305 L340,320 L335,345 L325,365 L310,375 L290,375 L270,365 L255,350 L250,330 L255,310 L275,295 Z",
    
    // Região Sul
    'PR': "M255,325 L285,320 L300,335 L305,350 L300,370 L285,380 L270,380 L255,370 L245,355 L245,340 L255,325 Z",
    'SC': "M275,355 L300,350 L315,365 L320,380 L315,395 L300,405 L285,405 L275,390 L270,375 L275,355 Z",
    'RS': "M235,365 L270,360 L290,375 L300,390 L295,415 L285,435 L270,445 L250,445 L230,435 L215,420 L210,400 L215,380 L235,365 Z"
  };

  const handleMouseEnter = (event: React.MouseEvent, estado: EstadoData) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const svgRect = (event.currentTarget as SVGPathElement).closest('svg')?.getBoundingClientRect();
    
    if (svgRect) {
      setTooltip({
        estado: estado.estado,
        notificacoes: estado.notificacoes,
        acordos: estado.acordos,
        desativacoes: estado.desativacoes,
        x: event.clientX - svgRect.left,
        y: event.clientY - svgRect.top
      });
    }
    setHoveredState(estado.estado);
  };

  const handleMouseLeave = () => {
    setTooltip(null);
    setHoveredState(null);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (tooltip) {
      const svgRect = (event.currentTarget as SVGSVGElement).getBoundingClientRect();
      setTooltip(prev => prev ? {
        ...prev,
        x: event.clientX - svgRect.left,
        y: event.clientY - svgRect.top
      } : null);
    }
  };

  return (
    <div className="relative">
      <div className="relative h-80 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden border border-gray-200">
        <svg 
          viewBox="0 0 500 450" 
          className="w-full h-full cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 100%)' }}
          onMouseMove={handleMouseMove}
        >
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.15"/>
            </filter>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Título do mapa */}
          <text x="250" y="25" textAnchor="middle" className="text-lg font-bold fill-gray-800">
            Brasil - Distribuição de Casos por Estado
          </text>
          
          {/* Estados do Brasil */}
          {estadosRanking.map((estado) => {
            const pathData = statePaths[estado.estado];
            if (!pathData) return null;

            const totalCasos = estado.notificacoes + estado.acordos + estado.desativacoes;
            const isHovered = hoveredState === estado.estado;
            
            // Cor baseada na intensidade dos casos
            const intensity = Math.min(totalCasos / 300, 1);
            const baseColor = isHovered ? 'rgba(59, 130, 246, 0.8)' : `rgba(59, 130, 246, ${0.4 + intensity * 0.4})`;

            return (
              <g key={estado.estado}>
                <path
                  d={pathData}
                  fill={baseColor}
                  stroke={isHovered ? "#1e40af" : "#3b82f6"}
                  strokeWidth={isHovered ? "2.5" : "1.5"}
                  className="transition-all duration-200 ease-in-out cursor-pointer"
                  filter={isHovered ? "url(#glow)" : "url(#shadow)"}
                  onMouseEnter={(e) => handleMouseEnter(e, estado)}
                  onMouseLeave={handleMouseLeave}
                />
                
                {/* Sigla do estado */}
                <text
                  x={pathData.includes('L') ? 
                    (pathData.split('L')[1]?.split(',')[0] || '250') : '250'}
                  y={pathData.includes('L') ? 
                    (parseInt(pathData.split('L')[1]?.split(',')[1]?.split(' ')[0] || '225') + 5) : 225}
                  textAnchor="middle"
                  className={`text-xs font-bold pointer-events-none transition-all duration-200 ${
                    isHovered ? 'fill-white text-shadow' : 'fill-gray-700'
                  }`}
                  style={{ 
                    fontSize: isHovered ? '11px' : '10px',
                    fontWeight: 'bold',
                    textShadow: isHovered ? '1px 1px 2px rgba(0,0,0,0.8)' : '1px 1px 1px rgba(0,0,0,0.5)'
                  }}
                >
                  {estado.estado}
                </text>
                
                {/* Indicador de alta atividade */}
                {totalCasos > 150 && (
                  <circle
                    cx={parseInt(pathData.split('L')[1]?.split(',')[0] || '250') + 12}
                    cy={parseInt(pathData.split('L')[1]?.split(',')[1]?.split(' ')[0] || '225') - 8}
                    r="3"
                    fill="#dc2626"
                    stroke="white"
                    strokeWidth="1"
                    className="animate-pulse pointer-events-none"
                  />
                )}
              </g>
            );
          })}
          
          {/* Indicadores de regiões */}
          <text x="160" y="80" textAnchor="middle" className="text-xs fill-gray-600 font-medium pointer-events-none">Norte</text>
          <text x="360" y="125" textAnchor="middle" className="text-xs fill-gray-600 font-medium pointer-events-none">Nordeste</text>
          <text x="230" y="210" textAnchor="middle" className="text-xs fill-gray-600 font-medium pointer-events-none">Centro-Oeste</text>
          <text x="325" y="275" textAnchor="middle" className="text-xs fill-gray-600 font-medium pointer-events-none">Sudeste</text>
          <text x="275" y="385" textAnchor="middle" className="text-xs fill-gray-600 font-medium pointer-events-none">Sul</text>
        </svg>

        {/* Tooltip customizado */}
        {tooltip && (
          <div
            className="absolute z-10 bg-white rounded-lg shadow-xl border border-gray-200 p-4 pointer-events-none transition-all duration-200"
            style={{
              left: Math.min(tooltip.x + 10, 400),
              top: Math.max(tooltip.y - 120, 10),
              minWidth: '220px'
            }}
          >
            <div className="space-y-2">
              <h4 className="font-bold text-gray-800 text-lg border-b border-gray-200 pb-2">
                {tooltip.estado}
              </h4>
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                    <span className="text-sm text-gray-700">Notificações</span>
                  </div>
                  <span className="font-semibold text-blue-600">{tooltip.notificacoes}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                    <span className="text-sm text-gray-700">Acordos</span>
                  </div>
                  <span className="font-semibold text-green-600">{tooltip.acordos}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                    <span className="text-sm text-gray-700">Desativações</span>
                  </div>
                  <span className="font-semibold text-red-600">{tooltip.desativacoes}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total de Casos:</span>
                  <span className="font-bold text-gray-800">
                    {tooltip.notificacoes + tooltip.acordos + tooltip.desativacoes}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Legenda */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm">Notificações</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm">Acordos</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm">Desativações</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-200 border border-blue-400 rounded"></div>
          <span className="text-sm">Baixa atividade</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 border border-blue-800 rounded"></div>
          <span className="text-sm">Alta atividade</span>
        </div>
      </div>
    </div>
  );
};

export default BrazilInteractiveMap;
