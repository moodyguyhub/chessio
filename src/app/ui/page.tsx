"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";

export default function UIPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-chessio-bg p-8 dark:bg-chessio-bg-dark text-chessio-text dark:text-chessio-text-dark space-y-12">
      <div className="max-w-4xl mx-auto space-y-12">
        
        <section className="space-y-4">
          <h1 className="text-3xl font-bold">Chessio UI Kit</h1>
          <p className="text-chessio-muted dark:text-chessio-muted-dark">
            Theme Check: Indigo (Primary) + Slate (Background/Text)
          </p>
        </section>

        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Action</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="primary" isLoading>Loading</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <Button size="sm">Small</Button>
            <Button size="md">Medium (Default)</Button>
            <Button size="lg">Large Button</Button>
          </div>
        </section>

        {/* Inputs */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Inputs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <Input label="Email Address" placeholder="alex@chessio.io" />
            <Input label="Password" type="password" placeholder="••••••••" />
            <Input label="With Error" placeholder="Incorrect input" error="This field is required." />
          </div>
        </section>

        {/* Badges */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Badges</h2>
          <div className="flex gap-4">
            <Badge variant="default">Level 1</Badge>
            <Badge variant="success">+15 XP</Badge>
            <Badge variant="warning">Rank 4</Badge>
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Standard Dashboard Card */}
            <Card>
              <CardHeader>
                <CardTitle>Level 0: The Basics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-chessio-muted dark:text-chessio-muted-dark mb-4">
                  Start here if you&apos;re new to chess. You&apos;ll learn how the pieces move.
                </p>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-chessio-primary h-2 rounded-full w-1/3"></div>
                </div>
                <p className="text-xs mt-2 text-chessio-muted dark:text-chessio-muted-dark">30% Complete</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Continue Level 0</Button>
              </CardFooter>
            </Card>

            {/* Task Card Example */}
            <Card className="border-l-4 border-l-chessio-primary">
              <CardContent className="pt-6">
                <span className="text-sm font-semibold text-chessio-primary uppercase tracking-wide">Task 1</span>
                <p className="mt-2 font-medium">Move the Rook to a5.</p>
                <div className="mt-4 flex gap-2">
                   <Button variant="secondary" size="sm">Hint</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Dialogs */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Dialogs</h2>
          <Button onClick={() => setIsDialogOpen(true)}>Open Completion Modal</Button>
          
          <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title="Lesson Complete!">
            <div className="flex flex-col items-center text-center space-y-4 py-4">
              <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center">
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
              </div>
              <p className="text-lg">You now know how the Rook moves.</p>
              <Badge variant="success" className="text-sm px-3 py-1">+15 XP Earned</Badge>
              <div className="w-full pt-4">
                <Button className="w-full" size="lg" onClick={() => setIsDialogOpen(false)}>Continue to Next Lesson</Button>
              </div>
            </div>
          </Dialog>
        </section>

      </div>
    </div>
  );
}
