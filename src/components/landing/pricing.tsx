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
import { Check } from "lucide-react";

export function Pricing() {
  const t = useTranslations("pricing");

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
          <p>{t("subtitle")}</p>
        </div>

        <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">
          {plans.map((plan) => {
            const features = t.raw(`${plan.key}.features`) as string[];

            const inner = (
              <>
                <CardHeader>
                  <CardTitle className="font-medium">
                    {t(`${plan.key}.name`)}
                  </CardTitle>
                  <span className="my-3 block text-2xl font-semibold">
                    {t(`${plan.key}.price`)}
                  </span>
                  <CardDescription className="text-sm">
                    {t(`${plan.key}.monthly`)}
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
