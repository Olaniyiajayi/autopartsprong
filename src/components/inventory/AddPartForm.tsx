import { useState } from "react";
import { Wrench, MapPin, DollarSign, ImageIcon, Sparkles, Tag, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const conditions = [
  { value: "new", label: "New", desc: "Brand new OEM" },
  { value: "tokunbo", label: "Tokunbo", desc: "Foreign Used Import" },
  { value: "nigerian-used", label: "Nigerian Used", desc: "Locally Used Part" },
];

/** Map form condition to DB value (parts.condition). */
const conditionToDb: Record<string, string> = {
  new: "NEW",
  tokunbo: "TOKUNBO",
  "nigerian-used": "NIGERIAN",
};

export function AddPartForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [partType, setPartType] = useState("Alternator");
  const [vehicleModel, setVehicleModel] = useState("Camry");
  const [yearRange, setYearRange] = useState("2018-2023");
  const [sku, setSku] = useState("AP-HND-ALT-001");
  const [category, setCategory] = useState("engine-components");
  const [nickname, setNickname] = useState("");
  const [condition, setCondition] = useState("tokunbo");
  const [price, setPrice] = useState("0.00");
  const [stock, setStock] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generatedName = `Toyota ${vehicleModel} ${partType} (${yearRange})`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Not signed in",
          description: "You must be signed in to add a part.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const { data: membership } = await supabase
        .from("organization_members")
        .select("organization_id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (!membership?.organization_id) {
        toast({
          title: "No tenant assigned",
          description: "You must be assigned to a store or hub to add parts.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const priceNum = parseFloat(price.replace(/,/g, "")) || null;
      const stockNum = Math.max(0, parseInt(stock, 10) || 0);

      const { error } = await supabase.from("parts").insert({
        organization_id: membership.organization_id,
        part_type: partType.trim(),
        vehicle_model: vehicleModel.trim(),
        year_range: yearRange.trim(),
        local_nickname: nickname.trim() || null,
        sku: sku.trim(),
        condition: conditionToDb[condition] ?? condition.toUpperCase(),
        category: category || null,
        display_name: generatedName,
        price_naira: priceNum,
        quantity_in_stock: stockNum,
        created_by: user.id,
      });

      if (error) {
        toast({
          title: "Failed to save part",
          description: error.message,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      toast({
        title: "Part saved",
        description: `${generatedName} has been added to inventory.`,
      });
      navigate("/dashboard/inventory");
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Something went wrong.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Part Definition */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-5">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
          <Wrench className="w-4 h-4 text-primary" />
          Part Definition
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Part Type</Label>
            <Select value={partType} onValueChange={setPartType}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Alternator">Alternator</SelectItem>
                <SelectItem value="Brake Pads">Brake Pads</SelectItem>
                <SelectItem value="Shock Absorbers">Shock Absorbers</SelectItem>
                <SelectItem value="Grille">Grille</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Vehicle Model</Label>
            <Input className="mt-1.5" value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Year Range</Label>
            <Input className="mt-1.5" value={yearRange} onChange={(e) => setYearRange(e.target.value)} />
          </div>
        </div>

        {/* Generated Name */}
        <div className="bg-secondary/50 border border-primary/20 rounded-lg p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
            Generated Part Name (Read Only)
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-primary">{generatedName}</p>
              <p className="text-xs text-primary/70">Automatically formatted based on selected fields above.</p>
            </div>
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">SKU / Part Number</Label>
            <Input className="mt-1.5" value={sku} onChange={(e) => setSku(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="engine-components">Engine Components</SelectItem>
                <SelectItem value="brake-system">Brake System</SelectItem>
                <SelectItem value="suspension">Suspension</SelectItem>
                <SelectItem value="body-parts">Body Parts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Localization & Condition */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-5">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
          <MapPin className="w-4 h-4 text-primary" />
          Localization & Condition
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Local Nickname</span>
            </div>
            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded font-medium uppercase">
              Popular in Nigeria
            </span>
          </div>
          <Input
            placeholder="e.g. Evil Spirit, Muscle, Big Daddy, End of Discussion"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Helps customers find parts using common local terminology used in Ladipo or Oworo.
          </p>
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Part Condition</Label>
          <div className="grid grid-cols-3 gap-3 mt-2">
            {conditions.map((c) => (
              <button
                key={c.value}
                onClick={() => setCondition(c.value)}
                className={`rounded-lg border-2 p-4 text-center transition-colors ${
                  condition === c.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <p className="font-semibold text-foreground">{c.label}</p>
                <p className="text-xs text-muted-foreground">{c.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing & Stock + Product Images */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-6 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
            <DollarSign className="w-4 h-4 text-primary" />
            Pricing & Stock
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold text-destructive">
              Selling Price (₦)
            </Label>
            <div className="relative mt-1.5">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-foreground">₦</span>
              <Input className="pl-7" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Initial Stock Level
            </Label>
            <div className="flex items-center gap-2 mt-1.5">
              <Input value={stock} onChange={(e) => setStock(e.target.value)} />
              <span className="text-sm text-muted-foreground font-medium">UNITS</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
            <ImageIcon className="w-4 h-4 text-primary" />
            Product Images
          </div>
          <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/40 transition-colors">
            <Upload className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="font-semibold text-foreground text-sm">Upload Photos</p>
            <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (Max 2MB)</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
        <Button type="button" variant="ghost" onClick={() => navigate("/dashboard/inventory")}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
        >
          {isSubmitting ? "Saving…" : "Save Part to Inventory"}
        </Button>
      </div>
    </form>
  );
}
