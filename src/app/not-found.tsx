import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="py-24 text-center xl1:py-36">
      <h1 className="text-4xl font-bold tracking-tight md:text-6xl">That page is not here</h1>
      <p className="mt-4 text-lg text-muted">The link may be old, or the fabric may have moved.</p>
      <div className="mt-8 flex justify-center gap-3"><ButtonLink href="/shop" size="lg">Browse fabrics</ButtonLink><ButtonLink href="/" variant="outline" size="lg">Home</ButtonLink></div>
    </Container>
  );
}
