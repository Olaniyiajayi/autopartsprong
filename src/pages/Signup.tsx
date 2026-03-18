import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { LayoutGrid, Building2, User, Upload } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Owner info
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [stateOfOrigin, setStateOfOrigin] = useState("");

  // Business info
  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({ title: "File too large", description: "Logo must be under 2MB.", variant: "destructive" });
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !password.trim() || !businessName.trim()) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (authError) {
        toast({ title: "Sign up failed", description: authError.message, variant: "destructive" });
        setIsSubmitting(false);
        return;
      }

      const user = authData.user;
      if (!user) {
        toast({ title: "Sign up failed", description: "Could not create user.", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }

      // 2. Update profile with owner demographics
      await supabase.from("profiles").update({
        phone: phone.trim() || null,
        date_of_birth: dateOfBirth || null,
        gender: gender || null,
        state_of_origin: stateOfOrigin.trim() || null,
      }).eq("id", user.id);

      // 3. Create organization
      const { data: org, error: orgError } = await supabase.from("organizations").insert({
        name: businessName.trim(),
        email: businessEmail.trim() || email.trim(),
        address: businessAddress.trim() || null,
        phone: businessPhone.trim() || null,
      }).select("id").single();

      if (orgError) {
        console.error("Org creation failed:", orgError);
      }

      // 4. Link user as owner
      if (org) {
        await supabase.from("organization_members").insert({
          organization_id: org.id,
          user_id: user.id,
          role: "owner" as const,
        });
      }

      // 5. Upload logo if provided
      if (logoFile && org) {
        const ext = logoFile.name.split(".").pop();
        const path = `logos/${org.id}.${ext}`;

        // Create bucket if needed (will fail silently if exists)
        const { error: uploadError } = await supabase.storage
          .from("organization-assets")
          .upload(path, logoFile, { upsert: true });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from("organization-assets")
            .getPublicUrl(path);

          await supabase.from("organizations")
            .update({ logo_url: urlData.publicUrl })
            .eq("id", org.id);
        }
      }

      toast({
        title: "Account created!",
        description: "Please check your email to verify your account before signing in.",
      });
      navigate("/login");
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border">
        <div className="container flex h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <LayoutGrid className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">AutoParts Pro</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12 px-4">
        <div className="w-full max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground">Create Your Account</h1>
          <p className="mt-2 text-muted-foreground">
            Set up your business on AutoParts Pro. You'll receive a verification email to confirm your account.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            {/* Owner Information */}
            <div className="bg-card rounded-xl border border-border p-6 space-y-5">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
                <User className="w-4 h-4 text-primary" />
                Owner Information
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" placeholder="Your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input id="password" type="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+234 xxx xxxx xxx" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="state">State of Origin</Label>
                  <Input id="state" placeholder="e.g. Lagos, Ogun, Kano" value={stateOfOrigin} onChange={(e) => setStateOfOrigin(e.target.value)} className="mt-1.5" />
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="bg-card rounded-xl border border-border p-6 space-y-5">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
                <Building2 className="w-4 h-4 text-primary" />
                Business Information
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input id="businessName" placeholder="e.g. Chinedu Auto Spares" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="businessEmail">Business Email</Label>
                  <Input id="businessEmail" type="email" placeholder="info@yourbusiness.com" value={businessEmail} onChange={(e) => setBusinessEmail(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="businessPhone">Business Phone</Label>
                  <Input id="businessPhone" type="tel" placeholder="+234 xxx xxxx xxx" value={businessPhone} onChange={(e) => setBusinessPhone(e.target.value)} className="mt-1.5" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <Textarea id="businessAddress" placeholder="e.g. Shop 45, Ladipo Market, Mushin, Lagos" value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} rows={2} className="mt-1.5" />
                </div>
                <div className="col-span-2">
                  <Label>Business Logo</Label>
                  <label
                    htmlFor="logoUpload"
                    className="mt-1.5 flex items-center gap-4 border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-primary/40 transition-colors"
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="w-16 h-16 object-contain rounded-lg" />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <Upload className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {logoFile ? logoFile.name : "Upload Logo"}
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (Max 2MB)</p>
                    </div>
                  </label>
                  <input id="logoUpload" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleLogoChange} className="hidden" />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {isSubmitting ? "Creating account…" : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Merchant Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
