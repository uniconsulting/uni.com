import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";

export function Hero() {
  return (
    <Section id="hero" className="pt-14 sm:pt-18 lg:pt-22">
      <Container>
        <div className="max-w-[760px]">
          <div className="text-on-bg text-4xl sm:text-5xl font-semibold leading-[1.05] tracking-tight">
            ЮНИ. ИИ в каждый бизнес
          </div>
          <div className="mt-4 text-white/80 text-base sm:text-lg leading-relaxed">
            Быстрые интеграции, понятные продукты, эффект в цифрах. Стилистику и логику секций дальше
            заполним строго по ТЗ.
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <GlassButton variant="primary" size="lg">
              Зарегистрироваться
            </GlassButton>
            <GlassButton variant="secondary" size="lg">
              Заказать звонок
            </GlassButton>
          </div>
        </div>

        <div className="mt-10">
          <GlassCard strength="strong" className="aspect-video w-full" />
        </div>
      </Container>
    </Section>
  );
}
