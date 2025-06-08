"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
    Wallet,
    Menu,
    X,
    Sparkles,
    Trophy,
    PenTool,
    BarChart3,
    User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [userAddress] = useState("0x1234...abcd");

    const navigation = [
        { name: "首页", href: "/", icon: Sparkles },
        { name: "比赛", href: "/contests", icon: Trophy },
        { name: "提交作文", href: "/submit", icon: PenTool },
        { name: "排行榜", href: "/leaderboard", icon: BarChart3 },
        { name: "个人中心", href: "/profile", icon: User },
    ];

    const connectWallet = async () => {
        // Mock wallet connection
        setIsWalletConnected(true);
    };

    return (
        <motion.header
            className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <motion.div
                        className="flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                AI作文评分平台
                            </span>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <NavigationMenu className="hidden md:flex">
                        <NavigationMenuList className="space-x-1">
                            {navigation.map((item) => (
                                <NavigationMenuItem key={item.name}>
                                    <Link
                                        href={item.href}
                                        legacyBehavior
                                        passHref
                                    >
                                        <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                                            <item.icon className="w-4 h-4 mr-2" />
                                            {item.name}
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* Wallet Connection */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isWalletConnected ? (
                            <motion.div
                                className="flex items-center space-x-2 bg-muted rounded-lg px-3 py-2"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <Avatar className="w-6 h-6">
                                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">
                                    {userAddress}
                                </span>
                            </motion.div>
                        ) : (
                            <Button
                                onClick={connectWallet}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                            >
                                <Wallet className="w-4 h-4 mr-2" />
                                连接钱包
                            </Button>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <motion.div
                        className="md:hidden"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border/40">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <item.icon className="w-4 h-4 mr-3" />
                                    {item.name}
                                </Link>
                            ))}
                            <div className="pt-3 border-t border-border/40">
                                {isWalletConnected ? (
                                    <div className="flex items-center px-3 py-2">
                                        <Avatar className="w-6 h-6 mr-3">
                                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                                            <AvatarFallback>U</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-medium">
                                            {userAddress}
                                        </span>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={connectWallet}
                                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                    >
                                        <Wallet className="w-4 h-4 mr-2" />
                                        连接钱包
                                    </Button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.header>
    );
}
