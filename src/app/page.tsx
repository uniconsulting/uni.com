import Header from "../components/sections/Header";

export default function Page() {
  return (
    <>
      <Header />

      {/* Дальше пойдут секции 2..12, пока можно оставить заглушки */}
      <main className="mx-auto max-w-[1240px] px-4">
        <section className="pt-10">
          <h1 className="text-[44px] font-semibold leading-[1.05] tracking-tight">
            Кабинет твоей <br /> команды ИИ-агентов
          </h1>
        </section>
      </main>
    </>
  );
}
