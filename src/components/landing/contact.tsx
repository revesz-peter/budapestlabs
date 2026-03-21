"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Check } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(1),
  email: z.email(),
  phone: z.string().optional(),
  business: z.string().optional(),
  plan: z.string().optional(),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const inputBase =
  "rounded-xl bg-foreground/5 text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus-visible:ring-0 transition-colors duration-200";

function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.2 }}
          className="text-xs text-red-400"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export function Contact() {
  const t = useTranslations("contact");
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <section id="contact" className="px-6 py-24 md:px-8 lg:px-16">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {t("label")}
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">{t("title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="glass py-20 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-foreground/5"
              >
                <Check className="h-8 w-8 text-foreground/40" />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="mb-2 text-xl font-semibold"
              >
                {t("form.successTitle")}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                className="text-muted-foreground"
              >
                {t("form.success")}
              </motion.p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="glass space-y-6 p-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm text-foreground/60">
                    {t("form.name")}
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder={t("form.namePlaceholder")}
                    className={`${inputBase} ${errors.name ? "border-red-400/50" : "border-border"}`}
                  />
                  <FieldError message={errors.name && t("form.errors.nameRequired")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm text-foreground/60">
                    {t("form.email")}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder={t("form.emailPlaceholder")}
                    className={`${inputBase} ${errors.email ? "border-red-400/50" : "border-border"}`}
                  />
                  <FieldError message={errors.email && t("form.errors.emailRequired")} />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm text-foreground/60">
                    {t("form.phone")}
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    placeholder={t("form.phonePlaceholder")}
                    className={`${inputBase} border-border`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business" className="text-sm text-foreground/60">
                    {t("form.business")}
                  </Label>
                  <Input
                    id="business"
                    {...register("business")}
                    placeholder={t("form.businessPlaceholder")}
                    className={`${inputBase} border-border`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan" className="text-sm text-foreground/60">
                  {t("form.plan")}
                </Label>
                <select
                  id="plan"
                  {...register("plan")}
                  className="flex h-9 w-full rounded-xl border border-border bg-foreground/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none transition-colors duration-200"
                >
                  <option value="" className="bg-background text-muted-foreground">
                    {t("form.planPlaceholder")}
                  </option>
                  <option value="starter" className="bg-background">
                    {t("form.planOptions.starter")}
                  </option>
                  <option value="business" className="bg-background">
                    {t("form.planOptions.business")}
                  </option>
                  <option value="pro" className="bg-background">
                    {t("form.planOptions.pro")}
                  </option>
                  <option value="unsure" className="bg-background">
                    {t("form.planOptions.unsure")}
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm text-foreground/60">
                  {t("form.message")}
                </Label>
                <Textarea
                  id="message"
                  {...register("message")}
                  rows={4}
                  placeholder={t("form.messagePlaceholder")}
                  className={`${inputBase} border-border`}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
              >
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? "..." : t("form.submit")}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
