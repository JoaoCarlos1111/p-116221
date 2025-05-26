
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

  // Paths SVG mais precisos dos estados brasileiros
  const statePaths: { [key: string]: string } = {
    // Região Norte
    'AM': "M50,80 L120,75 L140,90 L160,100 L180,110 L190,130 L185,150 L175,165 L160,170 L140,165 L120,160 L100,150 L80,140 L60,125 L50,105 Z",
    'RR': "M80,20 L110,15 L130,25 L135,40 L130,55 L110,60 L90,60 L75,50 L70,35 Z",
    'AP': "M180,30 L205,25 L220,35 L225,50 L220,65 L205,70 L190,70 L180,60 L175,45 Z",
    'PA': "M120,50 L170,45 L200,55 L220,70 L215,95 L205,115 L185,120 L165,115 L145,105 L130,90 L120,70 Z",
    'TO': "M170,100 L195,95 L210,110 L215,125 L210,145 L200,155 L185,160 L170,155 L165,140 L165,120 Z",
    'RO': "M75,115 L105,110 L120,125 L125,140 L120,155 L105,160 L90,160 L75,155 L70,140 L70,125 Z",
    'AC': "M30,115 L60,110 L75,125 L80,140 L75,155 L60,160 L45,160 L30,155 L25,140 L25,125 Z",
    
    // Região Nordeste
    'MA': "M210,70 L240,65 L260,80 L265,95 L260,110 L240,115 L220,115 L210,100 L205,85 Z",
    'PI': "M230,110 L255,105 L270,120 L275,135 L270,150 L255,155 L240,155 L230,140 L225,125 Z",
    'CE': "M270,80 L300,75 L315,90 L320,105 L315,120 L300,125 L285,125 L270,110 L265,95 Z",
    'RN': "M300,85 L320,80 L330,95 L335,110 L330,125 L320,130 L310,130 L300,115 L295,100 Z",
    'PB': "M310,105 L325,100 L335,115 L340,130 L335,145 L325,150 L315,150 L310,135 L305,120 Z",
    'PE': "M290,120 L315,115 L330,130 L335,145 L330,160 L315,165 L300,165 L290,150 L285,135 Z",
    'AL': "M305,145 L320,140 L330,155 L335,170 L330,185 L320,190 L310,190 L305,175 L300,160 Z",
    'SE': "M290,165 L310,160 L320,175 L325,190 L320,205 L310,210 L300,210 L290,195 L285,180 Z",
    'BA': "M240,130 L280,125 L300,140 L310,155 L305,180 L300,205 L285,220 L265,225 L245,220 L230,205 L225,180 L230,155 Z",
    
    // Região Centro-Oeste
    'MT': "M110,155 L150,150 L175,165 L185,180 L180,205 L170,225 L155,235 L135,230 L115,220 L100,205 L95,180 L105,165 Z",
    'MS': "M140,220 L165,215 L180,230 L185,245 L180,265 L170,280 L155,285 L140,280 L130,265 L125,250 L130,235 Z",
    'GO': "M170,175 L205,170 L225,185 L235,200 L230,220 L220,235 L205,240 L190,235 L175,220 L165,205 L165,190 Z",
    'DF': "M185,195 L200,190 L210,205 L215,220 L210,235 L200,240 L190,240 L185,225 L180,210 Z",
    
    // Região Sudeste
    'MG': "M220,210 L255,205 L280,220 L290,235 L285,260 L275,280 L260,290 L240,290 L220,280 L205,265 L200,245 L205,225 Z",
    'ES': "M270,230 L290,225 L300,240 L305,255 L300,270 L290,280 L280,280 L270,265 L265,250 Z",
    'RJ': "M260,260 L280,255 L295,270 L300,285 L295,300 L280,310 L265,310 L260,295 L255,280 L255,270 Z",
    'SP': "M210,270 L245,265 L265,280 L275,295 L270,320 L260,340 L245,350 L225,350 L205,340 L190,325 L185,305 L190,285 Z",
    
    // Região Sul
    'PR': "M190,300 L220,295 L235,310 L240,325 L235,345 L220,355 L205,355 L190,345 L180,330 L180,315 Z",
    'SC': "M210,330 L235,325 L250,340 L255,355 L250,370 L235,380 L220,380 L210,365 L205,350 Z",
    'RS': "M170,340 L205,335 L225,350 L235,365 L230,390 L220,410 L205,420 L185,420 L165,410 L150,395 L145,375 L150,355 Z"
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

  // Função para calcular a posição do texto baseada no centroide do path
  const getTextPosition = (pathData: string) => {
    const coords = pathData.match(/\d+/g);
    if (coords && coords.length >= 2) {
      const x = parseInt(coords[0]);
      const y = parseInt(coords[1]);
      return { x: x + 15, y: y + 15 };
    }
    return { x: 200, y: 200 };
  };

  return (
    <div className="relative">
      <div className="relative h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden border border-gray-200">
        <svg 
          viewBox="0 0 400 450" 
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
          <text x="200" y="25" textAnchor="middle" className="text-lg font-bold fill-gray-800">
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
            const baseColor = isHovered 
              ? 'rgba(59, 130, 246, 0.9)' 
              : `rgba(59, 130, 246, ${0.3 + intensity * 0.5})`;

            const textPos = getTextPosition(pathData);

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
                  x={textPos.x}
                  y={textPos.y}
                  textAnchor="middle"
                  className={`text-xs font-bold pointer-events-none transition-all duration-200 ${
                    isHovered ? 'fill-white' : 'fill-gray-700'
                  }`}
                  style={{ 
                    fontSize: isHovered ? '12px' : '10px',
                    fontWeight: 'bold',
                    textShadow: isHovered ? '1px 1px 2px rgba(0,0,0,0.8)' : '1px 1px 1px rgba(0,0,0,0.5)'
                  }}
                >
                  {estado.estado}
                </text>
                
                {/* Indicador de alta atividade */}
                {totalCasos > 150 && (
                  <circle
                    cx={textPos.x + 15}
                    cy={textPos.y - 10}
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
          <text x="100" y="60" textAnchor="middle" className="text-xs fill-gray-600 font-medium pointer-events-none">Norte</text>
          <text x="300" y="100" textAnchor="middle" className="text-xs fill-gray-600 font-medium pointer-events-none">Nordeste</text>
          <text x="170" y="180" textAnchor="middle" className="text-xs fill-gray-600 font-medium pointer-events-none">Centro-Oeste</text>
          <text x="260" y="250" textAnchor="middle" className="text-xs fill-gray-600 font-medium pointer-events-none">Sudeste</text>
          <text x="210" y="360" textAnchor="middle" className="text-xs fill-gray-600 font-medium pointer-events-none">Sul</text>
        </svg>

        {/* Tooltip customizado */}
        {tooltip && (
          <div
            className="absolute z-10 bg-white rounded-lg shadow-xl border border-gray-200 p-4 pointer-events-none transition-all duration-200"
            style={{
              left: Math.min(tooltip.x + 10, 300),
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
