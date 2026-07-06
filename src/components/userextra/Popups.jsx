import { Loader2 } from "lucide-react";
import { useOperation } from "../../context/OperationContext";


export default function OperationManager() {
  const { operations } = useOperation();

  if (!operations.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] space-y-3">

      {operations.map((op) => (
        <div
          key={op.id}
          className="w-80 rounded-2xl border border-white/10 bg-[#171b24] p-5 shadow-2xl"
        >
          <div className="flex items-center gap-3">

            <Loader2
              size={20}
              className="animate-spin text-blue-500"
            />

            <div>

              <p className="font-semibold text-white">
                {op.title}
              </p>

              <p className="text-sm text-zinc-400">
                {op.message}
              </p>

            </div>

          </div>
        </div>
      ))}

    </div>
  );
}