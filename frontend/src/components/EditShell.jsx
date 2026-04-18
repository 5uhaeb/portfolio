import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * Wraps an item so admins can drag-to-reorder, edit, delete.
 * Non-admins just see the child rendered as-is, no extra chrome.
 *
 *   <EditShell id={item._id} isAdmin={isAdmin} onEdit={...} onDelete={...}>
 *     <YourCard item={item} />
 *   </EditShell>
 */
export default function EditShell({ id, isAdmin, onEdit, onDelete, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isAdmin });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
  };

  if (!isAdmin) return <div>{children}</div>;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? 'opacity-80 dragging-shell' : ''}`}
    >
      {/* Admin control strip, hidden until hover */}
      <div className="absolute -top-3 right-3 z-20 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          {...attributes}
          {...listeners}
          className="px-2 py-1 bg-ink text-paper font-mono text-[10px] uppercase tracking-widest cursor-grab active:cursor-grabbing"
          aria-label="Drag to reorder"
          type="button"
        >
          ⇅ Drag
        </button>
        <button
          onClick={onEdit}
          className="px-2 py-1 bg-ink text-paper font-mono text-[10px] uppercase tracking-widest hover:bg-ember"
          type="button"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-2 py-1 bg-red-800 text-paper font-mono text-[10px] uppercase tracking-widest hover:bg-red-900"
          type="button"
        >
          Delete
        </button>
      </div>
      {/* Dashed outline makes editable zones obvious in admin mode */}
      <div className="ring-1 ring-transparent group-hover:ring-ink/25 transition-shadow">
        {children}
      </div>
    </div>
  );
}
