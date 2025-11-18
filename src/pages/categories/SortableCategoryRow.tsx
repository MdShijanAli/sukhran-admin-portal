import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Category } from "@/lib/types";

interface SortableCategoryRowProps {
  category: Category;
  onViewDetails: (category: Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function SortableCategoryRow({
  category,
  onViewDetails,
  onEdit,
  onDelete,
}: SortableCategoryRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={isDragging ? "bg-muted" : ""}
    >
      <TableCell>
        <div className="flex items-center gap-2">
          <button
            className="cursor-grab active:cursor-grabbing touch-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
          </button>
          <img
            src={category.image_url}
            alt={category.name}
            className="h-12 w-12 rounded-md object-cover"
          />
        </div>
      </TableCell>
      <TableCell className="font-medium">{category.name}</TableCell>
      <TableCell className="max-w-xs truncate">
        {category.description}
      </TableCell>
      <TableCell>
        <Badge variant="outline">{category.displayOrder}</Badge>
      </TableCell>
      <TableCell>
        <Badge variant="secondary">{category.sub_categories_count}</Badge>
      </TableCell>
      <TableCell>
        <Badge variant="secondary">{category.products_count}</Badge>
      </TableCell>
      <TableCell>
        <Badge variant={category.isActive ? "default" : "secondary"}>
          {category.isActive ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewDetails(category)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onEdit(category)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(category)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
