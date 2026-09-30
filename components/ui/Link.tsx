import type { ComponentProps } from "react";

// A plain anchor for hash and external links. Every variant and size is at
// least 44px tall so it works as a tap target. Focus comes from the global ring.
const variants = {
  text: "text-signal underline decoration-1 underline-offset-4 hover:decoration-2",
  button: "border border-ink px-5 font-medium hover:bg-ink hover:text-paper",
};

// "large" is the email in Contact: 20px on phones so an address fits one line.
const sizes = {
  small: "text-small",
  large: "text-body md:text-h2",
};

type Props = ComponentProps<"a"> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export default function Link({
  variant = "text",
  size = "small",
  className = "",
  ...props
}: Props) {
  return (
    <a
      className={`inline-flex min-h-11 items-center font-display ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
