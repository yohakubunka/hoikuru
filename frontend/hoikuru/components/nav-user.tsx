"use client"
import Link from "next/link";
// ログアウトアクション
import { signOutAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
// 非同期によるユーザ認証取得
// ページを開いたらuseEffectでユーザー情報を取得
// usestateで変数に
import { useState, useEffect } from "react";

// アイコンコンポーネント
import {
  ChevronsUpDown,
  LogOut,
} from "lucide-react"

// アバター関連コンポーネント
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

// ドロップダウンコンポーネント
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// サイドバーコンポーネント
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
// const user = getUserAction
export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  // const [userMail, setUserMail] = useState("")

  // useEffect(() => {
  //   const supabase = createClient();
  //   async function fetchUser() {
  //     const {
  //       data: { user },
  //       error,
  //     } = await supabase.auth.getUser();

  //     if (user) {
  //       setUserMail({
  //         email: user.email,
  //       });
  //     } else if (error) {
  //       console.error("Error fetching user:", error.message);
  //     }
  //   }
  //   setUserMail("userMail")
  // }, []);

  const { isMobile } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link href="./profile">プロフィール</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="./change-password">パスワード変更</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              <form action={signOutAction}>
                <button type="submit">ログアウト</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}