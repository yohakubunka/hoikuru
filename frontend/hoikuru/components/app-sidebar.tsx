"use client"
import * as React from "react"

// アイコン関連コンポーネント
import {
Smile,
  Pencil,
  Home,
  FileImage,
  Layout,
  Mail,
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
  Settings,
} from "lucide-react"

// サイドバーコンポーネント
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// サイドバー内コンテンツコンポーネント
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "ホイクル園",
      logo: GalleryVerticalEnd,
    },
    {
      name: "ホイクル２",
      logo: AudioWaveform,

    },
    {
      name: "あいめい",
      logo: Command,
    },
  ],
  navMain: [
    {
      title: "ダッシュボード",
      url: "/",
      icon: Home
    },
    {
      title: "お客様情報",
      url: "#",
      icon: Smile,
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
      <TeamSwitcher teams={data.teams} />
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