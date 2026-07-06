import React from 'react'
import { motion } from "framer-motion";
import {
  Check,
  Crown,
  HardDrive,
  ShieldCheck,
  Sparkles,
  Calendar,
  ArrowRight,
} from "lucide-react";
export default function PlanCard({ plan, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -10,
        transition: { duration: 0.2 },
      }}
      transition={{ duration: 0.45 }}
      className={`relative flex flex-col overflow-hidden rounded-3xl border backdrop-blur-xl ${
        plan.popular
          ? "border-blue-500/40 bg-gradient-to-b from-blue-500/10 to-white/5 shadow-[0_0_45px_rgba(59,130,246,0.18)] lg:scale-[1.03]"
          : "border-white/10 bg-white/5 hover:border-blue-500/20"
      }`}
    >
      {/* Top Gradient */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500" />

      {/* Background Glow */}
      {plan.popular && (
        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-blue-500/20 blur-3xl" />
      )}

      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute right-5 top-5">
          <div className="flex items-center gap-1 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-lg">
            <Sparkles size={13} />
            Most Popular
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col p-8">
        {/* Storage Badge */}

        <div className="mb-6 inline-flex w-fit items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1">
          <HardDrive
            size={15}
            className="mr-2 text-blue-400"
          />

          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            {plan.storage}
          </span>
        </div>

        {/* Plan Name */}

        <h3 className="text-3xl font-bold text-white">
          {plan.name}
        </h3>

        <p className="mt-2 text-sm text-gray-400">
          {plan.tagline}
        </p>

        {/* Price */}

        <div className="mt-8 flex items-end gap-2">
          <span className="text-5xl font-bold text-white">
            ₹{plan.price}
          </span>

          <span className="pb-2 text-lg text-gray-400">
            {plan.period}
          </span>
        </div>

        {/* Divider */}

        <div className="my-8 h-px bg-white/10" />

        {/* Features */}

        <div className="space-y-4">
          {plan.features.map((feature) => (
            <motion.div
              key={feature}
              whileHover={{ x: 4 }}
              className="flex items-start gap-3"
            >
              <div className="mt-0.5 rounded-full bg-emerald-500/10 p-1">
                <Check
                  size={14}
                  className="text-emerald-400"
                />
              </div>

              <span className="text-sm text-gray-300">
                {feature}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Extra Benefits */}

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-wider text-gray-500">
            Includes
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-300">
              SSL Security
            </span>

            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-300">
              AI Assistant
            </span>

            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-300">
              Cloud Backup
            </span>
          </div>
        </div>

        {/* CTA */}

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(plan)}
          className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-all duration-300 ${
            plan.popular
              ? "bg-blue-600 text-white hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30"
              : "border border-white/10 bg-white/5 text-white hover:border-blue-500/30 hover:bg-blue-500/10"
          }`}
        >
          {plan.cta}

          <ArrowRight size={18} />
        </motion.button>
      </div>
    </motion.div>
  );
}

