import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  title: string;
  columns: Column<T>[];
  data: T[];
  onAdd: () => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  searchPlaceholder?: string;
  searchField?: string;
}

export function DataTable<T extends { id: string; [key: string]: any }>({
  title,
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  searchPlaceholder = "Buscar...",
  searchField = "name",
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");

  const filtered = data.filter((item) =>
    !search || (item[searchField] && String(item[searchField]).toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-serif text-foreground">{title}</h1>
        <Button onClick={onAdd} className="gap-2">
          <Plus className="h-4 w-4" /> Adicionar
        </Button>
      </div>

      <div className="mb-4 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              <TableHead className="w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-8 text-muted-foreground">
                  Nenhum item encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render ? col.render(item) : String(item[col.key] ?? "")}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(item)} className="h-8 w-8">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(item)} className="h-8 w-8 text-destructive hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
