import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { EyeIcon, EyeOff, Lock, Mail } from "lucide-react";
import authService from "@/services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      console.log("Login success:", response);
      if (response.role?.name === "customer") {
        toast.error("Access denied. Customers cannot access the admin panel.");
        setLoading(false);
        await authService.logout();
        return;
      }
      if (response.id) {
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error(response?.response?.data?.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error caught in handleSubmit:", error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const bulletPoints = [
    "Real-time Analytics",
    "Comprehensive Management",
    "Secure & Reliable",
  ];

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary items-center justify-center p-12">
        <div className="max-w-md text-white">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/images/Skr-eng.png"
              alt="Shukran logo"
              className="w-40 h-auto object-contain"
            />
          </div>
          <h1 className="text-5xl  mb-6">Admin Panel</h1>
          <p className="text-xl opacity-90">
            Manage your business with powerful analytics and comprehensive tools
          </p>
          <div className="mt-12 space-y-4">
            {bulletPoints.map((point) => (
              <div key={point} className="flex items-center gap-3">
                <div className="size-6 rounded-full bg-white/20 flex items-center justify-center">
                  ✓
                </div>
                <span className="text-lg">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl ">Welcome Back</h2>
            <p className="mt-2 text-muted-foreground">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-3">
            <div className="space-y-1">
              <Label htmlFor="email">Email or Phone</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="text"
                  placeholder="admin@example.com or +1234567890"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
                {showPassword ? (
                  <EyeIcon
                    className="absolute right-3 top-3 h-5 w-5 text-muted-foreground cursor-pointer"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <EyeOff
                    className="absolute right-3 top-3 h-5 w-5 text-muted-foreground cursor-pointer"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between space-y-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                />
                <Label htmlFor="remember" className="text-sm cursor-pointer">
                  Remember me
                </Label>
              </div>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full space-y-2"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
