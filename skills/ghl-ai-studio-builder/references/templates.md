# Templates

Starting skeletons. Substitute real copy and names; keep the structure.

## Route page

```tsx
// src/routes/index.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site-layout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Deck Builders in Ottawa | Cedar & Composite | Brand" },
      { name: "description", content: "Custom cedar and composite decks built in 3 to 5 weeks. Free on-site quote, written warranty, local crew." },
      { property: "og:title", content: "Deck Builders in Ottawa | Brand" },
      { property: "og:description", content: "Custom cedar and composite decks built in 3 to 5 weeks." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-6xl">...</h1>
          <p className="mt-4 text-lg text-muted-foreground">...</p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/contact">Get a quote <ArrowRight className="ml-2 size-4" aria-hidden /></Link>
          </Button>
        </div>
        <div className="aspect-[4/3] rounded-xl bg-muted" role="img" aria-label="...">
          {/* REPLACE: hero image, ... */}
        </div>
      </section>
    </SiteLayout>
  );
}
```

## Shared layout

```tsx
// src/components/site-layout.tsx
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BackToTop } from "@/components/back-to-top";
import { AodaLoader } from "@/components/aoda-loader";

export function SiteLayout({ children, heroOverlay = false }: { children: ReactNode; heroOverlay?: boolean }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader overlay={heroOverlay} />
      <main id="main" className="flex-1">{children}</main>
      <SiteFooter />
      <BackToTop />
      <AodaLoader />
    </div>
  );
}
```

(The AODA core adds its own skip link when the page has none.)

```tsx
// src/components/aoda-loader.tsx
import { useEffect } from "react";

export function AodaLoader() {
  useEffect(() => {
    const w = window as typeof window & { AODA_ADA_CONFIG?: Record<string, unknown> };
    w.AODA_ADA_CONFIG = {
      statementUrl: "/accessibility",
      feedbackEmail: "info@mockup.ngynsolutions.com",
      side: "left",
      tokens: { "--aoda-accent": "oklch(...)", "--aoda-accent-strong": "oklch(...)", "--aoda-on-accent": "oklch(...)", "--aoda-accent-soft": "oklch(...)", "--aoda-font": "'Body', 'Body Fallback', sans-serif" },
    };
    if (document.querySelector('script[data-aoda-core]')) return;
    const s = document.createElement("script");
    s.src = "/aoda-ada.min.js";
    s.dataset.aodaCore = "";
    document.head.appendChild(s);
  }, []);
  return null;
}
```

Header: fixed bar; `overlay` = transparent until 40px scroll, otherwise solid with a spacer; keep `document.documentElement.style.scrollPaddingTop` equal to its height. Nav links as `<Link to="..." activeProps={{ className: "text-foreground" }}>`; mobile menu with shadcn `Sheet` (button has `aria-label="Open menu"`).

## Server function

```ts
// src/lib/contact.functions.ts
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  message: z.string().min(1).max(2000),
});

export const submitContact = createServerFn({ method: "POST" })
  .validator((data: unknown) => ContactSchema.parse(data))
  .handler(async ({ data }) => {
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
    if (webhookUrl) {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "website-contact" }),
      });
      if (!res.ok) return { success: false, message: "Something went wrong. Please call us instead." };
    } else {
      console.log("Contact submission", data);
    }
    return { success: true, message: "Thanks, we'll be in touch within one business day." };
  });
```

(Module-scope `ContactSchema` is a zod schema used by the validator, which matches AI Studio's own template. Any other helper or constant goes inside `.handler()`.)

## Form page

```tsx
// src/routes/contact.tsx
import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SiteLayout } from "@/components/site-layout";
import { submitContact } from "@/lib/contact.functions";

const schema = z.object({
  name: z.string().min(1, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  message: z.string().min(1, "Tell us a little about the project"),
});
type Values = z.infer<typeof schema>;

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [/* unique title, description, og:*, twitter:card */] }),
  component: ContactPage,
});

function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<Values>({ resolver: zodResolver(schema) });
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (values: Values) => {
    const res = await submitContact({ data: values });
    setResult(res);
    if (res.success) { reset(); navigate({ to: "/thank-you" }); }
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-xl px-4 py-20">
        <h1 className="text-3xl font-semibold">Contact us</h1>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} {...register("name")} />
            {errors.name && <p id="name-error" className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          {/* email, phone, message: same pattern */}
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending..." : "Send"}</Button>
          {result && (
            <p role="status" className={result.success ? "text-foreground" : "text-destructive"}>{result.message}</p>
          )}
        </form>
      </section>
    </SiteLayout>
  );
}
```

## Font links (only allowed `__root.tsx` edit)

Add to the existing `head()` of `src/routes/__root.tsx`, inside `links`:

```ts
{ rel: "preconnect", href: "https://fonts.googleapis.com" },
{ rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
{ rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=...&display=swap" },
```

Then apply families with Tailwind arbitrary values on wrappers (`font-[family-name:'Fraunces',serif]`) or ask the user to map `--font-sans`/`--font-serif` in tokens. Deliver this as an edit note, not a rewritten `__root.tsx`.
