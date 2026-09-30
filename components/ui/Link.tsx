import type { ComponentProps } from "react";

// A plain anchor for hash and external links. Both variants are at least
// 44px tall so they work as tap targets. Focus comes from the global ring.
const variants = {
  text: "text-signal underline decoration-1 underline-offset-4 hover:decoration-2",
  button: "border border-ink px-5 font-medium hover:bg-ink hover:text-paper",
};

type Props = ComponentProps<"a"> & {
  variant?: keyof typeof variants;
};

export default function Link({
  variant = "text",
  className = "",
  ...props
}: Props) {
  return (
    <a
      className={`inline-flex min-h-11 items-center font-display text-small ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
