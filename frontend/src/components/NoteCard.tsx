import { Pin, Trash2, Edit, Tag } from "lucide-react";
import { Note } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string, isPinned: boolean) => void;
}

export const NoteCard = ({ note, onEdit, onDelete, onTogglePin }: NoteCardProps) => {
  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-smooth hover:shadow-lg hover:-translate-y-1",
        "gradient-card border-border/50 backdrop-blur-sm",
        note.isPinned && "ring-2 ring-primary/20 shadow-glow"
      )}
    >
      <div className="p-6 space-y-4">
        {/* Header with Pin */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg text-foreground line-clamp-2 flex-1">
            {note.title}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 shrink-0 transition-smooth",
              note.isPinned ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
            onClick={() => onTogglePin(note._id, !note.isPinned)}
          >
            <Pin className={cn("h-4 w-4", note.isPinned && "fill-current")} />
          </Button>
        </div>

        {/* Content */}
        <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
          {note.content}
        </p>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs font-normal"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex flex-col gap-1">
            {note.category && (
              <span className="text-xs font-medium text-primary capitalize">
                {note.category}
              </span>
            )}
            <time className="text-xs text-muted-foreground">
              {new Date(note.updatedAt).toLocaleDateString()}
            </time>
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-smooth">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={() => onEdit(note)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(note._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
