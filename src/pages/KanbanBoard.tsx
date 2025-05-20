
import { useParams } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const columns = [
  { id: 'received', title: 'Recebido' },
  { id: 'analysis', title: 'Caso em Análise' },
  { id: 'pending', title: 'Pendente de Informação' },
  { id: 'completed', title: 'Concluído' }
];

export default function KanbanBoard() {
  const { sector } = useParams();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">Kanban - {sector}</h1>
      </header>
      
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.id} className="min-w-[300px]">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">{column.title}</h3>
              <div className="space-y-2 min-h-[200px]">
                {/* Cards will be rendered here */}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
