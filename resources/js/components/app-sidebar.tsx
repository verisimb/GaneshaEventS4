import { Link, usePage } from '@inertiajs/react';
import { BookOpen, CalendarCheck, ClipboardList, FolderGit2, LayoutGrid, Ticket, Award, CalendarDays } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { absensi, dashboard, pendaftar } from '@/routes';
import type { NavItem, SharedData } from '@/types';

const organizerNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Pendaftar',
        href: pendaftar(),
        icon: ClipboardList,
    },
    {
        title: 'Absensi',
        href: absensi(),
        icon: CalendarCheck,
    },
];

const userNavItems: NavItem[] = [
    {
        title: 'Kegiatan',
        href: '/user/kegiatan',
        icon: CalendarDays,
    },
    {
        title: 'Tiket',
        href: '/user/tiket',
        icon: Ticket,
    },
    {
        title: 'Sertifikat',
        href: '/user/sertifikat',
        icon: Award,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const auth = usePage<SharedData>().props.auth as any;
    const isOrganizer = auth?.user?.role === 'organizer';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={isOrganizer ? dashboard() : '/user/kegiatan'} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={isOrganizer ? organizerNavItems : userNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
