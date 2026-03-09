export function ErrorBanner({ message }: { message: string | null | undefined }) {
  if (!message) return null;
  return (
    <div className="bg-danger-light border border-danger-border text-danger text-sm rounded-lg px-4 py-3">
      {message}
    </div>
  );
}
