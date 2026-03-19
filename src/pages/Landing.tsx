import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Monitor, ShieldCheck, Users, Copy, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-blocks.jpg";
import { useState } from "react";

export default function Landing() {
  const [copied, setCopied] = useState(false);
  const referralLink = "autoparts.pro/waitlist?ref=ENGINE";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <span className="text-lg font-extrabold tracking-tight text-foreground">AutoParts Pro</span>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Solutions</a>
            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Merchant Hub</Link>
            <a href="#referral" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Referral</a>
            <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6">
              <Link to="/signup">Join Waitlist</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-primary">
        <div className="container py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
                <Zap className="h-3.5 w-3.5" />
                The Engineering Revolution
              </span>
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-primary-foreground md:text-6xl leading-[1.1]">
                The Future of Nigerian <span className="text-success">Spare Parts</span> is Coming.
              </h1>
              <p className="mt-6 text-base text-primary-foreground/80 max-w-lg">
                Join the Waitlist Today. From Ladipo to Aspamda, we are building the digital backbone for Nigerian merchants to scale their yard operations.
              </p>
              <div className="mt-8 flex flex-col gap-3 max-w-sm">
                <div className="relative">
                  <Input
                    placeholder="Business Email Address"
                    className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 h-12 pl-10"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-foreground/50">✉</span>
                </div>
                <div className="relative">
                  <Input
                    placeholder="Phone Number (WhatsApp Preferred)"
                    className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 h-12 pl-10"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-foreground/50">📞</span>
                </div>
                <Button className="h-12 bg-success text-success-foreground hover:bg-success/90 font-semibold rounded-lg">
                  Secure Early Access
                </Button>
              </div>
              <p className="mt-4 text-xs text-primary-foreground/60">
                Join 2,400+ mechanics and yard owners already in line.
              </p>
            </div>
            <div className="relative hidden lg:block">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img src={heroImage} alt="Building blocks representing growth" className="w-full h-auto object-cover" />
              </div>
              <div className="absolute -bottom-4 left-4 flex items-center gap-2 rounded-xl bg-card p-3 shadow-lg border border-border">
                <CheckCircle className="h-5 w-5 text-success" />
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Merchant Status</p>
                  <p className="text-sm font-bold text-foreground">Ladipo Verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Early */}
      <section id="features" className="py-20 md:py-28">
        <div className="container text-center">
          <h2 className="text-3xl font-extrabold text-foreground md:text-4xl">Why Join Early?</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            We're prioritizing the builders and merchants who keep Nigerian wheels turning.
          </p>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Monitor,
                color: "bg-primary/10 text-primary",
                title: "Exclusive Early-Bird Pricing",
                desc: "Lock in special transaction rates and subscription tiers reserved only for our foundation merchants. Beat the market inflation before we go public.",
              },
              {
                icon: ShieldCheck,
                color: "bg-success/10 text-success",
                title: "Priority Inventory Access",
                desc: 'Get first dibs on high-demand OEM and aftermarket stock coming through Aspamda and international shipments. Never tell a customer "Out of Stock" again.',
              },
              {
                icon: Users,
                color: "bg-primary/10 text-primary",
                title: "Direct Support for Yard Operations",
                desc: "Dedicated account managers to help digitize your physical yard inventory. We provide the tools and training to bring your shop into the 21st century.",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-8 text-left">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${f.color}`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-foreground">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Section */}
      <section id="referral" className="py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl rounded-3xl bg-gradient-to-br from-primary via-primary/80 to-success p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-foreground/15">
              <Users className="h-7 w-7 text-primary-foreground" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-primary-foreground md:text-4xl">
              Refer a fellow merchant and move up the line!
            </h2>
            <p className="mt-4 text-primary-foreground/80 max-w-md mx-auto">
              Spread the word to your colleagues in the market. Every successful referral jumps you 10 spots ahead in the queue.
            </p>
            <div className="mt-8 flex items-center justify-center gap-2">
              <div className="flex items-center rounded-full bg-primary-foreground/10 border border-primary-foreground/20 px-5 py-2.5">
                <span className="text-sm text-primary-foreground/80 font-mono">{referralLink}</span>
              </div>
              <Button
                onClick={handleCopy}
                className="rounded-full bg-success text-success-foreground hover:bg-success/90 font-semibold px-6"
              >
                {copied ? "Copied!" : "Copy Link"}
                {copied ? <CheckCircle className="ml-1.5 h-4 w-4" /> : <Copy className="ml-1.5 h-4 w-4" />}
              </Button>
            </div>
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="outline" className="rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Share on WhatsApp
              </Button>
              <Button variant="outline" className="rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Post on Facebook
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="container flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold text-foreground">AutoParts Pro</p>
            <p className="mt-1 text-xs text-muted-foreground">
              © {new Date().getFullYear()} AutoParts Pro. Built for Nigerian Mobility Engineers.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Merchant Agreement</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
