import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Crown,
  HardDrive,
  ShieldCheck,
  Sparkles,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

import { createSubscription } from "../../api/subscription.api";
import PlanCard from "./PlanCard";

const PLAN_CATALOG = {
  monthly: [
    {
      id: "plan_SnOQBLIj5Szjoa",
      name: "Starter",
      tagline: "Great for individuals",
      storage: "2 GB",
      price: 199,
      period: "/mo",
      cta: "Choose 2 GB",
      features: [
        "Secure cloud storage",
        "Link & folder sharing",
        "Basic support",
      ],
      popular: false,
    },
    {
      id: "plan_SnORKRSyPNKV4A",
      name: "Pro",
      tagline: "For creators & devs",
      storage: "5 GB",
      price: 399,
      period: "/mo",
      cta: "Choose 5 GB",
      features: [
        "Everything in Starter",
        "Priority uploads",
        "Email support",
      ],
      popular: true,
    },
    {
      id: "plan_SnOSFXhT5nacDR",
      name: "Ultimate",
      tagline: "Teams & power users",
      storage: "10 GB",
      price: 699,
      period: "/mo",
      cta: "Choose 10 GB",
      features: [
        "Everything in Pro",
        "Version history",
        "Priority support",
      ],
      popular: false,
    },
  ],

  yearly: [
    {
      id: "plan_SnOQvZ3V0ScfPB",
      name: "Starter",
      tagline: "Great for individuals",
      storage: "2 GB",
      price: 1999,
      period: "/yr",
      cta: "Choose 2 GB",
      features: [
        "Secure cloud storage",
        "Link & folder sharing",
        "Basic support",
      ],
      popular: false,
    },
    {
      id: "plan_SnORnXuC5wrR2n",
      name: "Pro",
      tagline: "For creators & devs",
      storage: "5 GB",
      price: 3999,
      period: "/yr",
      cta: "Choose 5 GB",
      features: [
        "Everything in Starter",
        "Priority uploads",
        "Email support",
      ],
      popular: true,
    },
    {
      id: "plan_SnOT3JdHCj8L5v",
      name: "Ultimate",
      tagline: "Teams & power users",
      storage: "10 GB",
      price: 6999,
      period: "/yr",
      cta: "Choose 10 GB",
      features: [
        "Everything in Pro",
        "Version history",
        "Priority support",
      ],
      popular: false,
    },
  ],
};


export default function Plans() {
  const [billingCycle, setBillingCycle] = useState("monthly");

  // Replace later with actual user
  const currentPlan = "Free";
  const usedStorage = "0.8 MB";
  const totalStorage = "1 GB";

  const plans = useMemo(
    () => PLAN_CATALOG[billingCycle],
    [billingCycle]
  );

    useEffect(() => {
    const razorpayScript = document.querySelector("#razorpay-script");
    if (razorpayScript) return;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.id = "razorpay-script";
    document.body.appendChild(script);
  }, []);

  async function handleSelect(plan) {
    const { subscriptionId } = await createSubscription(plan.id);
    console.log(subscriptionId);
    openRazorpayPopup({ subscriptionId });
  }

  return (
    <div className="mx-auto max-w-7xl space-y-10 p-8">

      {/* ======================================================= */}
      {/* HEADER */}
      {/* ======================================================= */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-4xl font-bold text-white">
            Billing & Plans
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Upgrade your workspace, unlock additional storage,
            and enjoy premium cloud features.
          </p>

        </div>

        {/* Billing Toggle */}

        <div className="flex rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-xl">

          <button
            onClick={() => setBillingCycle("monthly")}
            className={`rounded-lg px-6 py-2 text-sm font-medium transition-all duration-300 ${
              billingCycle === "monthly"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Monthly
          </button>

          <button
            onClick={() => setBillingCycle("yearly")}
            className={`relative rounded-lg px-6 py-2 text-sm font-medium transition-all duration-300 ${
              billingCycle === "yearly"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Yearly

            <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400">
              SAVE 16%
            </span>

          </button>

        </div>

      </div>

      {/* ======================================================= */}
      {/* CURRENT SUBSCRIPTION */}
      {/* ======================================================= */}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
      >

        <div className="grid gap-8 p-8 lg:grid-cols-2">

          {/* Left */}

          <div>

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-blue-500/10 p-3">

                <Crown
                  className="text-blue-400"
                  size={22}
                />

              </div>

              <div>

                <h2 className="text-xl font-semibold text-white">
                  Current Subscription
                </h2>

                <p className="text-sm text-gray-400">
                  Your current workspace plan
                </p>

              </div>

            </div>

            <div className="mt-8 space-y-5">

              <div>

                <p className="text-xs uppercase tracking-widest text-gray-500">
                  Active Plan
                </p>

                <h3 className="mt-1 text-3xl font-bold text-white">
                  {currentPlan}
                </h3>

              </div>

              <div className="flex items-center gap-3">

                <ShieldCheck
                  size={18}
                  className="text-emerald-400"
                />

                <span className="text-sm text-gray-300">
                  Subscription Active
                </span>

              </div>

              <div className="flex items-center gap-3">

                <Calendar
                  size={18}
                  className="text-gray-400"
                />

                <span className="text-sm text-gray-400">
                  Renews automatically after purchase
                </span>

              </div>

            </div>

          </div>

          {/* Right */}

          <div className="rounded-2xl border border-white/10 bg-black/20 p-6">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <HardDrive
                  size={20}
                  className="text-blue-400"
                />

                <h3 className="font-semibold text-white">
                  Storage Usage
                </h3>

              </div>

              <span className="text-sm text-blue-400">
                {usedStorage} / {totalStorage}
              </span>

            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "8%" }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
              />

            </div>

            <p className="mt-4 text-sm text-gray-400">
              Upgrade your plan to unlock more storage space and premium
              features.
            </p>

            <button
              className="mt-8 w-full rounded-xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-500"
            >
              Upgrade Plan
            </button>

          </div>

        </div>

      </motion.div>

      {/* ======================================================= */}
      {/* PRICING */}
      {/* ======================================================= */}

      <div className="text-center">

        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1">

          <Sparkles
            size={15}
            className="text-blue-400"
          />

          <span className="text-xs font-medium uppercase tracking-wider text-blue-400">
            Pricing
          </span>

        </div>

        <h2 className="mt-5 text-4xl font-bold text-white">
          Choose the perfect plan
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-gray-400">
          Whether you're storing personal files or managing large
          projects, pick the plan that fits your needs.
        </p>

      </div>

      {/* ======================================================= */}
      {/* PLAN GRID */}
      {/* ======================================================= */}

      <div className="grid gap-8 lg:grid-cols-3">

      {plans.map((plan, index) => ( 
        <PlanCard key={index} plan={plan} onSelect={handleSelect} />
))}

      </div>

      {/* ======================================================= */}


{/* ======================================================= */}
{/* FAQ */}
{/* ======================================================= */}

<div className="space-y-5">

  <div className="text-center">

    <h2 className="text-3xl font-bold text-white pt-20">
      Frequently Asked Questions
    </h2>

    <p className="mt-2 text-gray-400">
      Everything you need to know before upgrading.
    </p>

  </div>

  {[
    {
      q: "Can I change my plan later?",
      a: "Yes. Upgrade or downgrade your subscription whenever you want. Your storage limit updates automatically.",
    },
    {
      q: "What happens if I exceed my storage?",
      a: "You'll still have access to your files, but uploads will be paused until you free up space or upgrade.",
    },
    {
      q: "Is my payment secure?",
      a: "Yes. Payments are processed securely through Razorpay using encrypted transactions.",
    },
    {
      q: "Do yearly plans save money?",
      a: "Yes. Annual subscriptions provide significant savings compared to paying monthly.",
    },
  ].map((item) => (

    <details
      key={item.q}
      className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
    >

      <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 font-medium text-white">

        {item.q}

        <span className="transition duration-300 group-open:rotate-45 text-2xl">
          +
        </span>

      </summary>

      <div className="border-t border-white/10 px-6 py-5 text-gray-400 leading-7">

        {item.a}

      </div>

    </details>

  ))}

</div>

{/* ======================================================= */}
{/* FOOTER */}
{/* ======================================================= */}

<div className="rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 p-8 text-center">

  <h2 className="text-3xl font-bold text-white">
    Ready to unlock more storage?
  </h2>

  <p className="mx-auto mt-3 max-w-2xl text-gray-300">
    Upgrade today and enjoy faster uploads, larger storage,
    premium AI features, version history, and priority support.
  </p>

  <button className="mt-8 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30">

    Upgrade Now

  </button>

</div>

    </div>
  );
}

function openRazorpayPopup({ subscriptionId, user, course, onClose }) {
  console.log(course);
  const rzp = new Razorpay({
    key: "rzp_live_SnPiFEhZMGGNkM",
    //key: "rzp_test_RSg3Fv2zJuKq4V",
    description: "My first test payment.",
    name: "cloud storage ",
    subscription_id: subscriptionId,
    //image: "",
    notes: {
      // courseId: course.id,
      // courseName: course.name,
    },
    handler: async function (response) {
      console.log(response);
    },
  });

  rzp.on("payment.failed", function (response) {
    console.log(response);
  });

  rzp.open();
}
