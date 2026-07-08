import { Text } from "@chakra-ui/react";

interface HeaderProps {
  title: string;
  description: string;
  className: string;
}

export default function Heading({
  title,
  description,
  className,
}: HeaderProps) {
  return (
    <div className={className}>
      <h1 className="text-[#111111] text-4xl md:text-6xl font-bold text-center">
        {title}
      </h1>
      <Text
        color={"#2e2e2e"}
        className="mt-4 font-medium text-center line-clamp-3 leading-8 text-[18px] sm:text-[24px]"
      >
        {description}
      </Text>
    </div>
  );
}
