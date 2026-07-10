"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

export function Pricing() {
  const t = useTranslations("pricing");
  const [showTermTotal, setShowTermTotal] = React.useState(false);

  const plans = [
    { key: "starter", popular: false },
    { key: "business", popular: true },
    { key: "pro", popular: false },
  ] as const;

  return (
    <section id="pricing" className="py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h2 className="text-center text-4xl font-semibold lg:text-5xl">
            {t("title")}
          </h2>
          <p className="whitespace-pre-line">{t("subtitle")}</p>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                !showTermTotal ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {t("billingMonthly")}
            </span>
            <Switch
              checked={showTermTotal}
              onCheckedChange={setShowTermTotal}
              aria-label={t("billingToggleAriaLabel")}
            />
            <span
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium transition-colors",
                showTermTotal ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {t("billingTotal")}
              <span className="bg-foreground/10 rounded-full px-1.5 py-0.5 text-xs font-medium">
                {t("billingTotalDiscount")}
              </span>
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:mt-12 md:grid-cols-3">
          {plans.map((plan) => {
            const features = t.raw(`${plan.key}.features`) as string[];

            const inner = (
              <>
                <CardHeader>
                  <CardTitle className="font-medium">
                    {t(`${plan.key}.name`)}
                  </CardTitle>

                  {showTermTotal ? (
                    <div className="my-3 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-2xl font-semibold">
                          {t(`${plan.key}.termTotalPrepay`)}
                        </span>
                        <span className="border-border rounded-full border px-2 py-0.5 text-xs font-medium">
                          {t("prepayBadge")}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm line-through">
                        {t(`${plan.key}.termTotal`)}
                      </p>
                    </div>
                  ) : (
                    <span className="my-3 block text-2xl font-semibold">
                      {t(`${plan.key}.price`)}
                    </span>
                  )}

                  <CardDescription className="text-sm">
                    {showTermTotal ? (
                      <span className="block">{t("prepayIncludes")}</span>
                    ) : (
                      `${t(`${plan.key}.monthly`)} · ${t("monthlySuffix")}`
                    )}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <hr className="border-dashed" />

                  <ul className="list-outside space-y-3 text-sm">
                    {features.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="size-3 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="mt-auto">
                  <Button
                    asChild
                    variant={plan.popular ? "default" : "outline"}
                    className="w-full"
                  >
                    <Link href="#contact">{t("choosePlan")}</Link>
                  </Button>
                </CardFooter>
              </>
            );

            if (plan.popular) {
              return (
                <Card key={plan.key} className="relative">
                  <span className="bg-linear-to-br/increasing absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full from-purple-400 to-amber-300 px-3 py-1 text-xs font-medium text-amber-950 ring-1 ring-inset ring-white/20 ring-offset-1 ring-offset-gray-950/5">
                    {t("popular")}
                  </span>
                  <div className="flex h-full flex-col gap-6">{inner}</div>
                </Card>
              );
            }

            return (
              <Card key={plan.key} className="flex flex-col">
                {inner}
              </Card>
            );
          })}
        </div>

        <p className="text-muted-foreground mx-auto mt-8 max-w-2xl text-center text-sm">
          {t("disclaimer")}
        </p>
      </div>
    </section>
  );
}
