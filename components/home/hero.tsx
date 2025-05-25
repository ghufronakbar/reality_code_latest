"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export default function Hero() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Abstract background shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-background via-background to-transparent opacity-90" />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 2 }}
          className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-3xl"
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2, delay: 0.2 }}
          className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-3xl"
        />
      </div>
      
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col justify-center space-y-4"
          >
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Discover Premium Software Solutions
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Find and purchase high-quality applications for every need. From productivity tools to creative software.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/products">Browse Applications</Link>
              </Button>
              <Button variant="outline" size="lg">
                <Link href="/categories">Explore Categories</Link>
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center justify-center"
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl border bg-background shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 opacity-30" />
              <div className="absolute inset-0 p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500 ml-2" />
                  <div className="h-3 w-3 rounded-full bg-green-500 ml-2" />
                  <div className="flex-1" />
                </div>
                
                <div className="flex-1 flex flex-col bg-card border rounded-lg p-4 shadow-sm">
                  <div className="h-5 w-1/3 bg-muted rounded mb-2" />
                  <div className="h-4 w-2/3 bg-muted rounded mb-6" />
                  
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <div className="border rounded-md bg-background p-3 flex flex-col">
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 mb-2" />
                      <div className="h-3 w-1/2 bg-muted rounded" />
                    </div>
                    <div className="border rounded-md bg-background p-3 flex flex-col">
                      <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 mb-2" />
                      <div className="h-3 w-1/2 bg-muted rounded" />
                    </div>
                    <div className="border rounded-md bg-background p-3 flex flex-col">
                      <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 mb-2" />
                      <div className="h-3 w-1/2 bg-muted rounded" />
                    </div>
                    <div className="border rounded-md bg-background p-3 flex flex-col">
                      <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 mb-2" />
                      <div className="h-3 w-1/2 bg-muted rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}