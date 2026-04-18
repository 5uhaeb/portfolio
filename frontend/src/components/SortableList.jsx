import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

/**
 * Wires drag-and-drop for a list of items. Calls onReorder(newOrderOfIds)
 * when the user drops; caller is responsible for sending that up to the API.
 */
export default function SortableList({
  items,
  onReorder,
  strategy = 'vertical',
  children,
  disabled = false,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const ids = items.map((i) => i._id);
    const oldIdx = ids.indexOf(active.id);
    const newIdx = ids.indexOf(over.id);
    if (oldIdx === -1 || newIdx === -1) return;
    const next = arrayMove(ids, oldIdx, newIdx);
    onReorder(next);
  }

  const strat = strategy === 'grid' ? rectSortingStrategy : verticalListSortingStrategy;

  if (disabled) return <>{children}</>;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i._id)} strategy={strat}>
        {children}
      </SortableContext>
    </DndContext>
  );
}
