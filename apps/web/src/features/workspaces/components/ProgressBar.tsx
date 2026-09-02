import { Progress } from "@/components/ui/progress";

const ProgressBar = ({ progress }: { progress: number }) => {
  return <Progress value={progress} className="w-[60%]" />;
};

export default ProgressBar;
