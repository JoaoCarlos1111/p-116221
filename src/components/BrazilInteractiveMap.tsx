import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

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

  // URL do GeoJSON do Brasil
  const geoUrl = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";

  // Converter array para objeto para facilitar o acesso
  const estadosData = estadosRanking.reduce((acc, estado) => {
    acc[estado.estado] = estado;
    return acc;
  }, {} as Record<string, EstadoData>);

  // Mapeamento de nomes dos estados para siglas (incluindo variações)
  const stateNameToAbbr: { [key: string]: string } = {
    // Nomes completos padrão
    'Acre': 'AC',
    'Alagoas': 'AL',
    'Amapá': 'AP',
    'Amazonas': 'AM',
    'Bahia': 'BA',
    'Ceará': 'CE',
    'Distrito Federal': 'DF',
    'Espírito Santo': 'ES',
    'Goiás': 'GO',
    'Maranhão': 'MA',
    'Mato Grosso': 'MT',
    'Mato Grosso do Sul': 'MS',
    'Minas Gerais': 'MG',
    'Pará': 'PA',
    'Paraíba': 'PB',
    'Paraná': 'PR',
    'Pernambuco': 'PE',
    'Piauí': 'PI',
    'Rio de Janeiro': 'RJ',
    'Rio Grande do Norte': 'RN',
    'Rio Grande do Sul': 'RS',
    'Rondônia': 'RO',
    'Roraima': 'RR',
    'Santa Catarina': 'SC',
    'São Paulo': 'SP',
    'Sergipe': 'SE',
    'Tocantins': 'TO',
    // Variações possíveis nos dados GeoJSON
    'acre': 'AC',
    'alagoas': 'AL',
    'amapa': 'AP',
    'amapá': 'AP',
    'amazonas': 'AM',
    'bahia': 'BA',
    'ceara': 'CE',
    'ceará': 'CE',
    'distrito federal': 'DF',
    'espirito santo': 'ES',
    'espírito santo': 'ES',
    'goias': 'GO',
    'goiás': 'GO',
    'maranhao': 'MA',
    'maranhão': 'MA',
    'mato grosso': 'MT',
    'mato grosso do sul': 'MS',
    'minas gerais': 'MG',
    'para': 'PA',
    'pará': 'PA',
    'paraiba': 'PB',
    'paraíba': 'PB',
    'parana': 'PR',
    'paraná': 'PR',
    'pernambuco': 'PE',
    'piaui': 'PI',
    'piauí': 'PI',
    'rio de janeiro': 'RJ',
    'rio grande do norte': 'RN',
    'rio grande do sul': 'RS',
    'rondonia': 'RO',
    'rondônia': 'RO',
    'roraima': 'RR',
    'santa catarina': 'SC',
    'sao paulo': 'SP',
    'são paulo': 'SP',
    'sergipe': 'SE',
    'tocantins': 'TO',
    // Siglas como fallback
    'AC': 'AC',
    'AL': 'AL',
    'AP': 'AP',
    'AM': 'AM',
    'BA': 'BA',
    'CE': 'CE',
    'DF': 'DF',
    'ES': 'ES',
    'GO': 'GO',
    'MA': 'MA',
    'MT': 'MT',
    'MS': 'MS',
    'MG': 'MG',
    'PA': 'PA',
    'PB': 'PB',
    'PR': 'PR',
    'PE': 'PE',
    'PI': 'PI',
    'RJ': 'RJ',
    'RN': 'RN',
    'RS': 'RS',
    'RO': 'RO',
    'RR': 'RR',
    'SC': 'SC',
    'SP': 'SP',
    'SE': 'SE',
    'TO': 'TO'
  };

  const handleMouseEnter = (event: React.MouseEvent, geo: any) => {
    const stateName = geo.properties.name || geo.properties.NAME || geo.properties.Name || geo.properties.ESTADO || geo.properties.estado;
    const stateAbbr = stateNameToAbbr[stateName] || stateNameToAbbr[stateName?.toLowerCase()] || stateName;
    const stateData = estadosData[stateAbbr];

    if (stateData) {
      const rect = event.currentTarget.getBoundingClientRect();
      const containerRect = (event.currentTarget as SVGPathElement).closest('.map-container')?.getBoundingClientRect();

      if (containerRect) {
        setTooltip({
          estado: stateAbbr,
          notificacoes: stateData.notificacoes,
          acordos: stateData.acordos,
          desativacoes: stateData.desativacoes,
          x: event.clientX - containerRect.left,
          y: event.clientY - containerRect.top
        });
      }
      setHoveredState(stateAbbr);
    }
  };

  const handleMouseLeave = () => {
    setTooltip(null);
    setHoveredState(null);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (tooltip) {
      const containerRect = (event.currentTarget as HTMLElement).closest('.map-container')?.getBoundingClientRect();
      if (containerRect) {
        setTooltip(prev => prev ? {
          ...prev,
          x: event.clientX - containerRect.left,
          y: event.clientY - containerRect.top
        } : null);
      }
    }
  };

  const getStateColor = (geo: any) => {
    const stateName = geo.properties.name || geo.properties.NAME || geo.properties.Name || geo.properties.ESTADO || geo.properties.estado;
    const stateAbbr = stateNameToAbbr[stateName] || stateNameToAbbr[stateName?.toLowerCase()] || stateName;
    const stateData = estadosData[stateAbbr];

    if (!stateData) {
      return "#f3f4f6"; // Cor padrão para estados sem dados
    }

    // Total considerando apenas notificações + acordos (desativações não entram na soma)
    const total = stateData.notificacoes + stateData.acordos;
    const isHovered = hoveredState === stateAbbr;

    if (isHovered) {
      return "#1e40af"; // Azul escuro para hover
    }

    // Cores baseadas na intensidade dos casos
    if (total > 200) return "#003f5c";      // Muito alto
    if (total > 100) return "#2f4b7c";      // Alto
    if (total > 50) return "#665191";       // Médio-alto
    if (total > 20) return "#a05195";       // Médio
    if (total > 0) return "#d45087";        // Baixo
    return "#f95d6a";                       // Muito baixo
  };
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Erro ao carregar mapa</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative map-container" onMouseMove={handleMouseMove}>
      <div className="relative h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden border border-gray-200">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 700,
            center: [-55, -15]
          }}
          width={800}
          height={600}
          className="w-full h-full"
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stateName = geo.properties.name || geo.properties.NAME || geo.properties.Name || geo.properties.ESTADO || geo.properties.estado;
                const stateAbbr = stateNameToAbbr[stateName] || stateNameToAbbr[stateName?.toLowerCase()] || stateName;
                const stateData = estadosData[stateAbbr];

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getStateColor(geo)}
                    stroke="#ffffff"
                    strokeWidth={0.8}
                    onMouseEnter={(event) => handleMouseEnter(event, geo)}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      default: { 
                        outline: "none",
                        transition: "all 0.2s ease-in-out"
                      },
                      hover: { 
                        fill: "#1e40af",
                        outline: "none",
                        strokeWidth: 1.5,
                        cursor: "pointer"
                      },
                      pressed: { 
                        outline: "none" 
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

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
                  <span className="text-sm font-medium text-gray-700">Total de Ações:</span>
                  <span className="font-bold text-gray-800">
                    {tooltip.notificacoes + tooltip.acordos}
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