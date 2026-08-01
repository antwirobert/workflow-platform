import { cn, getInitials } from "@/lib/utils";

interface TextAvatarProps {
  name: string;
  colorClass: string;
  textClass: string;
  className: string;
}

const TextAvatar = ({
  name,
  colorClass,
  textClass,
  className,
}: TextAvatarProps) => {
  return (
    <div
      className={cn(
        "flex justify-center items-center rounded-md shrink-0",
        colorClass,
        textClass,
        className,
      )}
    >
      {getInitials(name)}
    </div>
  );
};

export default TextAvatar;
