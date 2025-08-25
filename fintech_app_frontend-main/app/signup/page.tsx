"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("https://fintech-app-backend.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstname, lastname }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Signup failed");
      toast({ title: "Signup successful!", description: `Welcome, ${data.firstname} ${data.lastname}. Please sign in.`, variant: "default" });
      router.push("/signin");
    } catch (err: any) {
      setError(err.message)
      toast({ title: "Signup failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <GlassCard className="p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input type="text" placeholder="First Name" value={firstname} onChange={e => setFirstname(e.target.value)} required />
            <Input type="text" placeholder="Last Name" value={lastname} onChange={e => setLastname(e.target.value)} required />
          </div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="button" className="absolute right-2 top-2 text-gray-500" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            <button type="button" className="absolute right-2 top-2 text-gray-500" onClick={() => setShowConfirmPassword(v => !v)} tabIndex={-1}>
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account? <a href="/signin" className="text-blue-600 dark:text-blue-400 underline">Sign In</a>
        </div>
      </GlassCard>
    </div>
  )
} 