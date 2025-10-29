import { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notesApi, Note } from "@/lib/api";
import { NoteCard } from "@/components/NoteCard";
import { NoteDialog } from "@/components/NoteDialog";
import { SearchBar } from "@/components/SearchBar";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", searchQuery, selectedCategory, selectedTag, sortBy, sortOrder],
    queryFn: () =>
      notesApi.getAll({
        search: searchQuery || undefined,
        category: selectedCategory || undefined,
        tag: selectedTag || undefined,
        sortBy,
        order: sortOrder,
      }),
  });

  const createMutation = useMutation({
    mutationFn: notesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsDialogOpen(false);
      toast({
        title: "Note created",
        description: "Your note has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      notesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsDialogOpen(false);
      setEditingNote(null);
      toast({
        title: "Note updated",
        description: "Your note has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: notesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveNote = (noteData: any) => {
    if (editingNote) {
      updateMutation.mutate({ id: editingNote._id, data: noteData });
    } else {
      createMutation.mutate(noteData);
    }
  };

  const handleDeleteNote = (id: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleTogglePin = (id: string, isPinned: boolean) => {
    updateMutation.mutate({ id, data: { isPinned } });
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsDialogOpen(true);
  };

  const handleCreateNew = () => {
    setEditingNote(null);
    setIsDialogOpen(true);
  };

  const handleClearFilters = () => {
    setSelectedCategory("");
    setSelectedTag("");
  };

  const notes = data?.data || [];
  const pinnedNotes = notes.filter((note) => note.isPinned);
  const unpinnedNotes = notes.filter((note) => !note.isPinned);

  const availableCategories = Array.from(
    new Set(notes.map((note) => note.category).filter(Boolean))
  ) as string[];

  const availableTags = Array.from(
    new Set(notes.flatMap((note) => note.tags || []))
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-lg bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                My Note
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {data?.count || 0} {data?.count === 1 ? "note" : "notes"}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <Button
                onClick={handleCreateNew}
                size="lg"
                className="gradient-primary shadow-glow"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Note
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <FilterSidebar
              selectedCategory={selectedCategory}
              selectedTag={selectedTag}
              sortBy={sortBy}
              sortOrder={sortOrder}
              availableCategories={availableCategories}
              availableTags={availableTags}
              onCategoryChange={setSelectedCategory}
              onTagChange={setSelectedTag}
              onSortChange={(newSortBy, newOrder) => {
                setSortBy(newSortBy);
                setSortOrder(newOrder);
              }}
              onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Notes Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-destructive">Failed to load notes</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Make sure the API server is running on http://localhost:3000
                </p>
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">
                  {searchQuery || selectedCategory || selectedTag
                    ? "No notes found matching your filters"
                    : "No notes yet. Create your first note!"}
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Pinned Notes */}
                {pinnedNotes.length > 0 && (
                  <div>
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                      Pinned
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                      {pinnedNotes.map((note) => (
                        <NoteCard
                          key={note._id}
                          note={note}
                          onEdit={handleEditNote}
                          onDelete={handleDeleteNote}
                          onTogglePin={handleTogglePin}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Regular Notes */}
                {unpinnedNotes.length > 0 && (
                  <div>
                    {pinnedNotes.length > 0 && (
                      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                        All Notes
                      </h2>
                    )}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                      {unpinnedNotes.map((note) => (
                        <NoteCard
                          key={note._id}
                          note={note}
                          onEdit={handleEditNote}
                          onDelete={handleDeleteNote}
                          onTogglePin={handleTogglePin}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Note Dialog */}
      <NoteDialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingNote(null);
        }}
        onSave={handleSaveNote}
        note={editingNote}
      />
    </div>
  );
};

export default Index;
