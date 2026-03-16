import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LayoutGrid, MessageCircle, Wallet, Package, CreditCard, Check, MapPin, Mail, Phone } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <LayoutGrid className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">AutoParts Pro</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</a>
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
              <Link to="/login">Merchant Login</Link>
            </Button>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/signup">Create Account</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="container py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Empower Your Spare Parts Business.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              All-in-one inventory and sales platform built specifically for the Nigerian market. Digitalize your shop, from Ladipo to the world.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                <Link to="/signup">Create Account</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 px-8">
                <a href="#pricing">View Pricing</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section id="about" className="py-20 md:py-28 border-t border-border">
        <div className="container">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Our Mission</p>
          <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">
            Modernizing Nigeria&apos;s Largest Auto Markets.
          </h2>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            We provide digital tools to manage inventory and sales from Ladipo to Aspamda. Join thousands of merchants already growing with AutoParts Pro.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "10k+", label: "Merchants" },
              { value: "500k+", label: "Parts Cataloged" },
              { value: "N2B+", label: "Processed" },
              { value: "24/7", label: "Support" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-card p-6">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28 bg-muted/30 border-t border-border">
        <div className="container">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Tailored for the Nigerian Seller.
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Everything you need to scale your yard and increase sales without the headache of manual tracking.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MessageCircle, title: "WhatsApp Integration", desc: "Share inventory links and reply to customers instantly." },
              { icon: Wallet, title: "Yard Capital", desc: "Access inventory-backed financing for your business." },
              { icon: Package, title: "Bulk Management", desc: "Upload and manage your entire used stock in minutes." },
              { icon: CreditCard, title: "Local Payments", desc: "Accept Opay, Moniepoint, Kuda and more." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-28 border-t border-border">
        <div className="container">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Simple, Transparent Pricing.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Choose the plan that fits your yard size.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6 flex flex-col">
              <h3 className="font-semibold text-foreground">Starter</h3>
              <p className="mt-2 text-2xl font-bold text-foreground">Free</p>
              <ul className="mt-6 space-y-3 flex-1">
                {["Up to 50 parts", "Basic Inventory", "Cash Tracking"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="mt-6 border-primary text-primary hover:bg-primary/10 w-full">
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>

            <div className="relative rounded-xl border-2 border-primary bg-card p-6 flex flex-col shadow-lg">
              <span className="absolute -top-3 right-4 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                MOST POPULAR
              </span>
              <h3 className="font-semibold text-foreground">Growth</h3>
              <p className="mt-2 text-2xl font-bold text-foreground">N15,000 <span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              <ul className="mt-6 space-y-3 flex-1">
                {["Unlimited parts", "WhatsApp Shop Link", "Advanced Reports", "5 Team Members"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90 w-full">
                <Link to="/signup">Choose Growth</Link>
              </Button>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 flex flex-col">
              <h3 className="font-semibold text-foreground">Pro</h3>
              <p className="mt-2 text-2xl font-bold text-foreground">N45,000 <span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              <ul className="mt-6 space-y-3 flex-1">
                {["Everything in Growth", "Priority Yard Capital", "Multiple Yard Locations", "Dedicated Manager"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="mt-6 border-primary text-primary hover:bg-primary/10 w-full">
                <Link to="/signup">Choose Pro</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 md:py-28 bg-muted/30 border-t border-border">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Get in Touch</h2>
              <p className="mt-4 text-muted-foreground">
                Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as we can.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Our Headquarters</p>
                    <p className="text-sm text-muted-foreground">Lagos, Nigeria</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Email Us</p>
                    <a href="mailto:support@autoparts.ng" className="text-sm text-primary hover:underline">support@autoparts.ng</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <p className="text-sm text-muted-foreground">+234 800 AUTOPARTS</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <Input className="mt-1.5" placeholder="Your name" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Phone Number</label>
                  <Input className="mt-1.5" placeholder="+234 800 000 0000" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Market Location</label>
                  <Input className="mt-1.5" placeholder="e.g. Ladipo Market" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Message</label>
                  <Textarea className="mt-1.5 min-h-[100px]" placeholder="How can we help your business?" />
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <Link to="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <LayoutGrid className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-foreground">AutoParts Pro</span>
              </Link>
              <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                The #1 digital tool for spare parts dealers in Nigeria.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Company</p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li><a href="#about" className="hover:text-foreground transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">News</a></li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Platform</p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                  <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                  <li><Link to="/login" className="hover:text-foreground transition-colors">Merchant Login</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Legal</p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </div>
          <p className="mt-12 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} AutoParts Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
