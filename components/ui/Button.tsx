import { Button } from "@chakra-ui/react";
import Link from "next/link";

interface ButtonProps {
  buttonName: string;
  buttonNameSec: string;
  className: string;
  padding: number;
  linkOne: string;
  linkTwo: string;
  bgColor: string;
  textColor: string;
}

export default function DoubleButton({
  buttonName,
  buttonNameSec,
  className,
  padding,
  bgColor,
  textColor,
  linkOne,
  linkTwo,
}: ButtonProps) {
  return (
    <div className={className}>
      {/* Primary Button */}
      <Link href={linkOne}>
        <Button
          bg={bgColor}
          color={textColor}
          p={padding}
          rounded={"full"}
          cursor={"pointer"}
          transition={"all 0.3s ease"}
          _hover={{
            bg: "#FF771F",
            transform: "translateY(-3px)",
            boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
          }}
          _active={{
            transform: "scale(0.98)",
          }}
        >
          {buttonName}
        </Button>
      </Link>

      {/* Secondary Button */}
      <Link href={linkTwo}>
        <Button
          border={`1px solid ${bgColor}`}
          bg={"transparent"}
          color={bgColor}
          p={padding}
          rounded={"full"}
          transition={"all 0.3s ease"}
          _hover={{
            bg: "#FF771F",
            color: "white",
            transform: "translateY(-3px)",
            boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
          }}
          _active={{
            transform: "scale(0.98)",
          }}
        >
          {buttonNameSec}
        </Button>
      </Link>
    </div>
  );
}
