import { ErrorState } from "@/components/ui/error-state/ErrorState";

export default function NotFound() {
  return (
    <div className="h-screen w-full">
      <ErrorState status={404} />
    </div>
  );
}
