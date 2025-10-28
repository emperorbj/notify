import { Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterSidebarProps {
  selectedCategory: string;
  selectedTag: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  availableCategories: string[];
  availableTags: string[];
  onCategoryChange: (category: string) => void;
  onTagChange: (tag: string) => void;
  onSortChange: (sortBy: string, order: "asc" | "desc") => void;
  onClearFilters: () => void;
}

export const FilterSidebar = ({
  selectedCategory,
  selectedTag,
  sortBy,
  sortOrder,
  availableCategories,
  availableTags,
  onCategoryChange,
  onTagChange,
  onSortChange,
  onClearFilters,
}: FilterSidebarProps) => {
  const hasActiveFilters = selectedCategory || selectedTag;

  return (
    <Card className="p-6 space-y-6 gradient-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-lg">Filters</h2>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select 
          value={selectedCategory || "all"} 
          onValueChange={(value) => onCategoryChange(value === "all" ? "" : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {availableCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tag Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Tags</label>
        <div className="flex flex-wrap gap-2">
          {availableTags.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tags available</p>
          ) : (
            availableTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                className="cursor-pointer transition-smooth hover:scale-105"
                onClick={() => onTagChange(selectedTag === tag ? "" : tag)}
              >
                {tag}
              </Badge>
            ))
          )}
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Sort by</label>
        <Select
          value={`${sortBy}-${sortOrder}`}
          onValueChange={(value) => {
            const [newSortBy, newOrder] = value.split("-") as [string, "asc" | "desc"];
            onSortChange(newSortBy, newOrder);
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Newest first</SelectItem>
            <SelectItem value="createdAt-asc">Oldest first</SelectItem>
            <SelectItem value="updatedAt-desc">Recently updated</SelectItem>
            <SelectItem value="title-asc">Title (A-Z)</SelectItem>
            <SelectItem value="title-desc">Title (Z-A)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};
