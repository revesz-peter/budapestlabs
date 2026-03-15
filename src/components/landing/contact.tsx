"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";

export function Contact() {
  const t = useTranslations("contact");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: integrate with backend
    setSubmitted(true);
  }

  return (
    <section id="contact" className="px-6 py-24 md:px-8 lg:px-16">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-white/40">
            {t("label")}
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">{t("title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/50">
            {t("subtitle")}
          </p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {submitted ? (
            <div className="glass py-16 text-center">
              <p className="text-lg font-medium">{t("form.success")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass space-y-6 p-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm text-white/60"
                  >
                    {t("form.name")}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder={t("form.namePlaceholder")}
                    className="rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-white/30 focus-visible:ring-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm text-white/60"
                  >
                    {t("form.email")}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder={t("form.emailPlaceholder")}
                    className="rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-white/30 focus-visible:ring-0"
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm text-white/60"
                  >
                    {t("form.phone")}
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder={t("form.phonePlaceholder")}
                    className="rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-white/30 focus-visible:ring-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="business"
                    className="text-sm text-white/60"
                  >
                    {t("form.business")}
                  </Label>
                  <Input
                    id="business"
                    name="business"
                    placeholder={t("form.businessPlaceholder")}
                    className="rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-white/30 focus-visible:ring-0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan" className="text-sm text-white/60">
                  {t("form.plan")}
                </Label>
                <select
                  id="plan"
                  name="plan"
                  className="flex h-9 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
                >
                  <option value="" className="bg-black text-white/30">
                    {t("form.planPlaceholder")}
                  </option>
                  <option value="starter" className="bg-black">
                    {t("form.planOptions.starter")}
                  </option>
                  <option value="business" className="bg-black">
                    {t("form.planOptions.business")}
                  </option>
                  <option value="pro" className="bg-black">
                    {t("form.planOptions.pro")}
                  </option>
                  <option value="unsure" className="bg-black">
                    {t("form.planOptions.unsure")}
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="message"
                  className="text-sm text-white/60"
                >
                  {t("form.message")}
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder={t("form.messagePlaceholder")}
                  className="rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-white/30 focus-visible:ring-0"
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-full bg-white text-black hover:bg-white/90"
              >
                <Send className="mr-2 h-4 w-4" />
                {t("form.submit")}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
