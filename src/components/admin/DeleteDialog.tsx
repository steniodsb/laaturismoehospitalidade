import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  itemName?: string;
}

const DeleteDialog = ({ open, onClose, onConfirm, loading, itemName }: DeleteDialogProps) => (
  <AlertDialog open={open} onOpenChange={onClose}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
        <AlertDialogDescription>
          Tem certeza que deseja excluir {itemName ? `"${itemName}"` : "este item"}? Esta ação não pode ser desfeita.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} disabled={loading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
          {loading ? "Excluindo..." : "Excluir"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default DeleteDialog;
