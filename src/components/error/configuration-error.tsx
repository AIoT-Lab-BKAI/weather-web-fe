export function ConfigurationError({
  message,
}: {
  message: string;
}) {
  return (
    <div>
      <h1>Configuration error</h1>
      <p>{message}</p>
    </div>
  );
}
