import { cn } from "@/lib/utils";

interface CustomButtonProps {
  disabled?: boolean;
  isRounded?: boolean;
}

export default function CustomButton({
  disabled,
  isRounded,
}: CustomButtonProps) {
  return (
    // <button
    //   className={`
    //     ${disabled ? "bg-gray-400" : "bg-blue-600"} ${
    //     isRounded ? "rounded-full" : "rounded-none"
    //   } p-2 text-white font-semibold`}
    // >
    //   testing
    // </button>
    <button
      className={cn(
        "p-2 text-white font-semibold",
        disabled ? "bg-gray-400" : "bg-blue-600",
        isRounded ? "rounded-full" : "rounded-none"
      )}
    >
      testing
    </button>
  );
}
