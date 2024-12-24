"use client"
import * as React from "react"
import {

  Pencil,
  Home,
  FileImage,
  Layout,
  Mail,
  Settings,
} from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
// アバター
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"




// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "ダッシュボード",
      url: "#",
      icon: Home
    },
    {
      title: "お客様情報",
      url: "#",
      icon: Pencil,
    },
    {
      title: "投稿",
      url: "#",
      icon: Pencil,
      items: [
        {
          title: "新規投稿",
          url: "#",
        },
        {
          title: "投稿一覧",
          url: "#",
        },
        {
          title: "カテゴリー",
          url: "#",
        },
      ],
    },
    {
      title: "メディア",
      url: "#",
      icon: FileImage,
      items: [
        {
          title: "サンプル",
          url: "#",
        },
      ],
    },
    {
      title: "ページ編集",
      url: "#",
      icon: Layout,
      items: [
        {
          title: "サンプル",
          url: "#",
        },
      ],
    },
    {
      title: "お問い合わせ",
      url: "#",
      icon: Mail,
      items: [
        {
          title: "サンプル",
          url: "#",
        },
      ],
    },
    {
      title: "設定",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "サンプル",
          url: "#",
        },
      ],
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      <div className="flex gap-4 p-2 items-center">
            <Avatar className="flex-none">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex-1 grow">
              <p>ホイクル園</p>
              <a className="text-slate-400 text-sm" href="/.">サイト表示</a>
            </div>
          </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}