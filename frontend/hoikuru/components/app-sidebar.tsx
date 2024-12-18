import { Edit, FileImage, Layout, Mail, Home, Inbox, Settings } from "lucide-react"

// サイドバー
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar"

// ドロップダウンメニュー
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// アバター
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Menu items.
const items = [
  {
    title: "ダッシュボード",
    url: "#",
    icon: Home,
  },
  {
    title: "お客様情報",
    url: "#",
    icon: Inbox,
  },
  {
    title: "投稿",
    url: "#",
    icon: Edit,
  },
  {
    title: "メディア",
    url: "#",
    icon: FileImage,
  },
  {
    title: "ページ編集",
    url: "#",
    icon: Layout,
  },
  {
    title: "お問い合わせ",
    url: "#",
    icon: Mail,
  },
  {
    title: "設定",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
      <SidebarHeader className="mb-4">
            <div className="flex gap-4 items-center">
              <Avatar className="flex-none">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex-1 grow">
                <p>ホイクル園</p>
                <a href="">sssssss</a>
              </div>
            </div>
          </SidebarHeader>
        <SidebarGroup>
         
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger>アカウント</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>プロフィール</DropdownMenuItem>
              <DropdownMenuItem>パスワード変更</DropdownMenuItem>
              <DropdownMenuItem>ログアウト</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  )
}
