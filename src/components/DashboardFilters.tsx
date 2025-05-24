
import { useState } from 'react';
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

export type FilterValues = {
  period: string;
  brands: string[];
  sector: string;
  status: string;
  caseType: string;
  dateRange: { from: Date | undefined; to: Date | undefined };
}

export function DashboardFilters({ onFilterChange }: { onFilterChange: (filters: FilterValues) => void }) {
  const [filters, setFilters] = useState<FilterValues>({
    period: 'last30',
    brands: [],
    sector: 'all',
    status: 'all',
    caseType: 'all',
    dateRange: { from: undefined, to: undefined }
  });

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      period: 'last30',
      brands: [],
      sector: 'all',
      status: 'all',
      caseType: 'all',
      dateRange: { from: undefined, to: undefined }
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="p-4 bg-card rounded-lg shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Select value={filters.period} onValueChange={(value) => setFilters({ ...filters, period: value })}>
          <option value="last7">Últimos 7 dias</option>
          <option value="last30">Últimos 30 dias</option>
          <option value="last180">Últimos 6 meses</option>
          <option value="last365">Últimos 12 meses</option>
          <option value="custom">Personalizado</option>
        </Select>

        {filters.period === 'custom' && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange.from ? (
                  filters.dateRange.to ? (
                    <>
                      {format(filters.dateRange.from, "P")} - {format(filters.dateRange.to, "P")}
                    </>
                  ) : (
                    format(filters.dateRange.from, "P")
                  )
                ) : (
                  <span>Selecione as datas</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="range"
                selected={{ from: filters.dateRange.from, to: filters.dateRange.to }}
                onSelect={(range) => 
                  setFilters({ ...filters, dateRange: { from: range?.from, to: range?.to } })
                }
              />
            </PopoverContent>
          </Popover>
        )}

        <Select value={filters.sector} onValueChange={(value) => setFilters({ ...filters, sector: value })}>
          <option value="all">Todos os Setores</option>
          <option value="iptools">IP Tools</option>
          <option value="atendimento">Atendimento</option>
          <option value="financeiro">Financeiro</option>
        </Select>

        <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
          <option value="all">Todos os Status</option>
          <option value="active">Ativos</option>
          <option value="finished">Finalizados</option>
          <option value="progress">Em andamento</option>
          <option value="defaulter">Inadimplentes</option>
        </Select>

        <Select value={filters.caseType} onValueChange={(value) => setFilters({ ...filters, caseType: value })}>
          <option value="all">Todos os Tipos</option>
          <option value="notification">Notificação</option>
          <option value="agreement">Acordo extrajudicial</option>
          <option value="payment">Pagamento</option>
        </Select>

        <div className="flex gap-2">
          <Button onClick={handleApplyFilters} className="flex-1">Aplicar</Button>
          <Button onClick={handleResetFilters} variant="outline" className="flex-1">Limpar</Button>
        </div>
      </div>
    </div>
  );
}
