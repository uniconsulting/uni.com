import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { GlassCard } from "@/components/ui/glass-card";

export function PlaceholderSection({ id, title }: { id: string; title: string }) {
  return (
    <Section id={id}>
      <Container>
        <div className="text-white/90 text-2xl sm:text-3xl font-semibold">{title}</div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <GlassCard className="h-40" />
          <GlassCard className="h-40" />
          <GlassCard className="h-40" />
        </div>
      </Container>
    </Section>
  );
}
