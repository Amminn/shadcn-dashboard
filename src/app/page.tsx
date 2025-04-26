import { Button } from "@/components/ui/button";
import CustomButton from "./CustomButton";

export default function Home() {
  return (
    <div className="container mx-auto flex flex-col gap-2">
      <h1>nextjs website</h1>
      <div className="w-[250px] flex flex-col gap-2">
        <CustomButton isRounded disabled />
        <Button>another test</Button>
      </div>
    </div>
  );
}
