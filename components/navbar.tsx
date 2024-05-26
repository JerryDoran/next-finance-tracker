'use client';

import { usePathname } from 'next/navigation';
import Logo from './logo';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';

export default function Navbar() {
  return (
    <>
      <DesktopNavbar />
    </>
  );
}

const items = [
  { label: 'Dashboard', link: '/' },
  { label: 'Transactions', link: '/transactions' },
  { label: 'Manage', link: '/manage' },
];

function DesktopNavbar() {
  return (
    <header className='hidden border-separate border-b bg-background md:block'>
      <nav className='container flex items-center justify-between px-8'>
        <div className='flex h-[80px] min-h-[60px] items-center gap-x-4'>
          <Logo />
          <div className='flex h-full'>
            {items.map((item) => (
              <NavbarItem
                key={item.label}
                link={item.link}
                label={item.label}
              />
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}

function NavbarItem({ link, label }: { link: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <div className='relative flex items-center'>
      <Link
        href={link}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'w-full justify-start text-lg text-muted-foreground hover:text-foreground transition',
          isActive && 'text-foreground'
        )}
      >
        {label}
      </Link>
    </div>
  );
}
