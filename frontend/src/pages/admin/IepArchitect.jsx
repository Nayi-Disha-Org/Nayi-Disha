import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function IepArchitect() {
  const [columns, setColumns] = useState({
    goalBank: {
      name: "Clinical Macro-Goals (Bank)",
      items: [
        { id: "goal-1", content: "Improve Fine Motor Skills", badge: "Physical", color: "bg-blue-100 text-blue-700" },
        { id: "goal-2", content: "Increase Sustained Attention", badge: "Cognitive", color: "bg-purple-100 text-purple-700" },
        { id: "goal-3", content: "Independent Dressing", badge: "Life Skill", color: "bg-emerald-100 text-emerald-700" },
        { id: "goal-4", content: "Emotional Regulation", badge: "Behavioral", color: "bg-orange-100 text-orange-700" }
      ]
    },
    dailyRoutine: {
      name: "Aarav's Daily Routine (Home)",
      items: [
        { id: "task-1", content: "Buttoning Shirt (5 mins)", badge: "Morning", color: "bg-amber-100 text-amber-700" },
        { id: "task-2", content: "Sort Colored Blocks", badge: "Afternoon", color: "bg-indigo-100 text-indigo-700" }
      ]
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  // Handles the logic when an item is dropped
  const onDragEnd = (result) => {
    const { source, destination } = result;

    // If dropped outside a valid droppable area, do nothing
    if (!destination) return;

    // If dropped in the exact same spot, do nothing
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;

    // Clone the arrays to avoid mutating state directly
    const sourceItems = [...columns[sourceColumn].items];
    const destItems = sourceColumn === destColumn ? sourceItems : [...columns[destColumn].items];

    // Remove item from source
    const [removed] = sourceItems.splice(source.index, 1);

    // Add item to destination
    destItems.splice(destination.index, 0, removed);

    // Update state
    setColumns({
      ...columns,
      [sourceColumn]: {
        ...columns[sourceColumn],
        items: sourceItems
      },
      [destColumn]: {
        ...columns[destColumn],
        items: destItems
      }
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    // TODO: Connect this to axios.post() to save the new routine to PostgreSQL
    setTimeout(() => {
      setIsSaving(false);
      alert("Routine successfully synced to database!");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#0b132b]">IEP Routine Architect</h1>
            <p className="text-slate-600 font-medium mt-1">Drag and drop clinical macro-goals to build daily home routines.</p>
          </div>
          <Link 
            to="/?role=admin" 
            className="px-4 py-2 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm inline-block"
          >
            ← Back to Dashboard
          </Link>
        </header>

        {/* Action Bar */}
        <div className="mb-8 flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#ff7a59] text-white rounded-full flex items-center justify-center font-bold text-lg">AS</div>
            <div>
              <h3 className="font-black text-[#0b132b]">Aarav Sharma</h3>
              <p className="text-xs font-medium text-slate-500">ID: 2748-XXXX-9812</p>
            </div>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-2.5 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 ${isSaving ? 'bg-emerald-400' : 'bg-emerald-600 hover:bg-emerald-700'}`}
          >
            {isSaving ? 'Syncing...' : '💾 Save Routine Blueprint'}
          </button>
        </div>

        {/* Drag and Drop Interface */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Render Columns Dynamically */}
            {Object.entries(columns).map(([columnId, column]) => (
              <div key={columnId} className="w-full md:w-1/2 flex flex-col bg-slate-100 rounded-3xl p-5 border-2 border-slate-200 shadow-inner min-h-[500px]">
                
                <div className="flex justify-between items-center mb-6 px-2">
                  <h2 className="text-xl font-black text-slate-700">{column.name}</h2>
                  <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                    {column.items.length} Items
                  </span>
                </div>

                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-grow rounded-2xl p-2 transition-colors ${
                        snapshot.isDraggingOver ? 'bg-indigo-50 border-2 border-dashed border-indigo-200' : ''
                      }`}
                    >
                      {column.items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-4 mb-4 rounded-2xl border font-medium text-sm transition-all ${
                                snapshot.isDragging 
                                  ? 'bg-[#0b132b] text-white border-[#0b132b] scale-105 shadow-2xl rotate-2' 
                                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 shadow-sm'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span>{item.content}</span>
                                <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md ${item.color || 'bg-slate-100 text-slate-600'}`}>
                                  {item.badge}
                                </span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

              </div>
            ))}

          </div>
        </DragDropContext>

      </div>
    </div>
  );
}