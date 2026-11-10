import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import ContactForm from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact us | Travailaway",
  description:
    "Get in touch with the Travailaway team. We read every message and reply by email.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f7faf8]">
      <SiteHeader />

      <section className="bg-[#104c3a] px-4 py-14 text-white md:py-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold md:text-5xl">Contact us</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-emerald-50">
            Have a question, an idea or a problem to report? Send us a message
            and we will reply by email.
          </p>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-xl">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <ContactForm />
          </div>
          <p className="mt-6 text-center text-sm text-gray-500">
            Travailaway is run by Molongi Investments Company SMC Limited.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
