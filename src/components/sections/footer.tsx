import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer id="contacts" className="py-12 border-t border-white/10">
      <Container>
        <div className="text-white/85 font-semibold">ЮНИ</div>
        <div className="mt-2 text-white/70 text-sm">
          Контакты и юридический блок добавим по ТЗ.
        </div>
        <div className="mt-6 text-white/55 text-xs">© {new Date().getFullYear()} ЮНИ</div>
      </Container>
    </footer>
  );
}
