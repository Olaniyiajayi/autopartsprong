import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, User, ChevronRight, Save, Plus, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CONDITION_OPTIONS = [
  { value: "TOKUNBO", label: "TOKUNBO" },
  { value: "NEW", label: "NEW" },
  { value: "NIGERIAN", label: "NIGERIAN" },
] as const;

type RowState = {
  id: string;
  partType: string;
  vehicleModel: string;
  yearRange: string;
  localNickname: string;
  sku: string;
  condition: string;
};

function isCompleteRow(row: RowState): boolean {
  return !!(
    row.partType?.trim() &&
    row.vehicleModel?.trim() &&
    row.yearRange?.trim() &&
    row.localNickname?.trim() &&
    row.sku?.trim() &&
    row.condition
  );
}

const initialRows: RowState[] = [
  { id: "1", partType: "Brake Pads", vehicleModel: "Toyota Camry", yearRange: "2007-2011", localNickname: "Muscle", sku: "BP-TY-001", condition: "TOKUNBO" },
  { id: "2", partType: "Headlight As", vehicleModel: "Honda Accord", yearRange: "2008-2012", localNickname: "Evil Spirit", sku: "HL-HD-099", condition: "NEW" },
  { id: "3", partType: "Engine Block", vehicleModel: "Toyota Corolla", yearRange: "2003-2008", localNickname: "Big Daddy", sku: "EB-TY-502", condition: "NIGERIAN" },
  { id: "4", partType: "", vehicleModel: "", yearRange: "", localNickname: "", sku: "", condition: "" },
];

const BulkUpload = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<RowState[]>(initialRows);

  const completeCount = rows.filter(isCompleteRow).length;
  const draftCount = rows.filter((r) => !isCompleteRow(r)).length;

  const updateRow = (id: string, field: keyof RowState, value: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        partType: "",
        vehicleModel: "",
        yearRange: "",
        localNickname: "",
        sku: "",
        condition: "",
      },
    ]);
  };

  const clearAll = () => setRows([{ ...initialRows[3], id: String(Date.now()) }]);

  const exportDraftToCsv = () => {
    const draftRows = rows.filter((r) => !isCompleteRow(r));
    const headers = ["PART TYPE", "VEHICLE MODEL", "YEAR RANGE", "LOCAL NICKNAME", "SKU / NUMBER", "CONDITION"];
    const csvContent = [
      headers.join(","),
      ...draftRows.map((r) =>
        [r.partType, r.vehicleModel, r.yearRange, r.localNickname, r.sku, r.condition].map((c) => `"${c}"`).join(",")
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bulk-upload-draft.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveAllToInventory = () => {
    const toSave = rows.filter(isCompleteRow);
    if (toSave.length === 0) return;
    // Placeholder: in a real app this would call an API
    console.log("Save to inventory:", toSave);
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 flex flex-col pl-64 bg-background">
        <header className="fixed top-0 left-64 right-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button onClick={() => navigate("/inventory")} className="hover:text-foreground transition-colors">
              Inventory
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">Bulk Part Upload</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search entries..." className="pl-9 w-52 bg-background" />
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
        </header>

        <div className="flex-1 p-6 pt-20 max-w-full">
          <h1 className="text-2xl font-bold text-foreground">Bulk Entry Table</h1>
          <p className="text-muted-foreground mt-1 mb-6">
            Add multiple parts quickly for the Lagos warehouse inventory system. Prices in Nigerian Naira (N).
          </p>

          <div className="flex justify-end mb-4">
            <Button onClick={saveAllToInventory} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Save className="w-4 h-4" />
              Save All to Inventory
            </Button>
          </div>

          <div className="rounded-lg border border-border overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PART TYPE</TableHead>
                  <TableHead>VEHICLE MODEL</TableHead>
                  <TableHead>YEAR RANGE</TableHead>
                  <TableHead>LOCAL NICKNAME</TableHead>
                  <TableHead>SKU / NUMBER</TableHead>
                  <TableHead>CONDITION</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => {
                  const complete = isCompleteRow(row);
                  return (
                    <TableRow key={row.id}>
                      <TableCell>
                        {complete ? (
                          row.partType
                        ) : (
                          <Input
                            placeholder="Select Type"
                            value={row.partType}
                            onChange={(e) => updateRow(row.id, "partType", e.target.value)}
                            className="min-w-[120px]"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {complete ? (
                          row.vehicleModel
                        ) : (
                          <Input
                            placeholder="e.g. Camry"
                            value={row.vehicleModel}
                            onChange={(e) => updateRow(row.id, "vehicleModel", e.target.value)}
                            className="min-w-[100px]"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {complete ? (
                          row.yearRange
                        ) : (
                          <Input
                            placeholder="e.g. 2018-2023"
                            value={row.yearRange}
                            onChange={(e) => updateRow(row.id, "yearRange", e.target.value)}
                            className="min-w-[100px]"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {complete ? (
                          row.localNickname
                        ) : (
                          <Input
                            placeholder="e.g. Evil Spirit"
                            value={row.localNickname}
                            onChange={(e) => updateRow(row.id, "localNickname", e.target.value)}
                            className="min-w-[100px]"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {complete ? (
                          row.sku
                        ) : (
                          <Input
                            placeholder="SKU-000"
                            value={row.sku}
                            onChange={(e) => updateRow(row.id, "sku", e.target.value)}
                            className="min-w-[80px]"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {complete ? (
                          <Badge
                            className={cn(
                              "rounded-full",
                              row.condition === "TOKUNBO" && "bg-primary/10 text-primary border-primary/20",
                              row.condition === "NEW" && "bg-blue-100 text-blue-800 border-blue-200",
                              row.condition === "NIGERIAN" && "bg-orange-100 text-orange-800 border-orange-200"
                            )}
                          >
                            {row.condition}
                          </Badge>
                        ) : (
                          <Select
                            value={row.condition || undefined}
                            onValueChange={(v) => updateRow(row.id, "condition", v)}
                          >
                            <SelectTrigger className={cn("min-w-[120px]", !row.condition && "text-muted-foreground")}>
                              <SelectValue placeholder="CONDITION" />
                            </SelectTrigger>
                            <SelectContent>
                              {CONDITION_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <Button onClick={addRow} variant="outline" className="gap-2 mt-4">
            <Plus className="w-4 h-4" />
            Add New Part Row
          </Button>

          <div className="flex items-center justify-between mt-6 text-sm text-muted-foreground">
            <span>
              {completeCount > 0 && (
                <>
                  <span className="text-primary font-medium">✔ {completeCount} complete row{completeCount !== 1 ? "s" : ""} ready for upload.</span>
                  {draftCount > 0 && ` ${draftCount} draft row${draftCount !== 1 ? "s" : ""}.`}
                </>
              )}
              {completeCount === 0 && draftCount > 0 && `${draftCount} draft row${draftCount !== 1 ? "s" : ""}.`}
            </span>
            <div className="flex items-center gap-4">
              <button onClick={clearAll} className="hover:text-foreground transition-colors">
                Clear All
              </button>
              <Button variant="outline" size="sm" className="gap-2" onClick={exportDraftToCsv}>
                <Download className="w-4 h-4" />
                Export Draft to CSV
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BulkUpload;
