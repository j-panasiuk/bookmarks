import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  title: string;
  error?: string;
}>;

export function Fallback({ children, title, error }: Props) {
  return (
    <div>
      <h2>{title}</h2>
      {error ? <pre>{error}</pre> : null}
      {children}
    </div>
  );
}
