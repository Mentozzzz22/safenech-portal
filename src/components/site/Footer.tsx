import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="border-line border-t">
      <div className="text-muted mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="space-y-2">
          <Logo />
          <p>Лицензии, разрешения и аккредитации в Казахстане.</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/cabinet" className="hover:text-fg">
            Кабинет клиента
          </Link>
          <Link href="/manager" className="hover:text-fg">
            Менеджер
          </Link>
          <Link href="/admin" className="hover:text-fg">
            Админка
          </Link>
        </div>
        <p className="text-xs">Демо-макет. Цены условные.</p>
      </div>
    </footer>
  );
}
