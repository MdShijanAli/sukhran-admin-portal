import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, EyeIcon, EyeOff, Lock, Phone } from "lucide-react";
import authService from "@/services/authService";

type Step = "request" | "reset";

export default function ForgotPassword() {
  const navigate = useNavigate();

  // Step management
  const [currentStep, setCurrentStep] = useState<Step>("request");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form data
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Request OTP
  const handleRequestOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.forgotPasswordOtpSent(mobile);

      console.log("OTP request response:", response);
      toast.success(response.message || "Verification code sent successfully!");
      setCurrentStep("reset");
    } catch (error: unknown) {
      console.error("OTP request error:", error);
      const apiError =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { error_message?: string } } })
          : null;
      toast.error(
        apiError?.response?.data?.error_message ||
          "Failed to send verification code",
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset Password with OTP
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.forgotPassword({
        mobile,
        otp_code: otpCode,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      console.log("Reset password response:", response);
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (error: unknown) {
      console.error("Reset password error:", error);
      const apiError =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { error_message?: string } } })
          : null;
      toast.error(
        apiError?.response?.data?.error_message || "Failed to reset password",
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle OTP input keydown
  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const bulletPoints = [
    "Secure Password Reset",
    "Quick Verification",
    "24/7 Support Available",
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
          <h1 className="text-5xl  mb-6">Password Recovery</h1>
          <p className="text-xl opacity-90">
            Reset your password securely in just a few simple steps
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

      {/* Right Side - Forms */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Back to Login */}
          <Button
            variant="ghost"
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Button>

          {/* Step 1: Request OTP */}
          {currentStep === "request" && (
            <>
              <div className="text-center">
                <h2 className="text-3xl ">Forgot Password?</h2>
                <p className="mt-2 text-muted-foreground">
                  Enter your mobile number to receive a verification code
                </p>
              </div>

              <form onSubmit={handleRequestOTP} className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="mobile"
                      type="text"
                      placeholder="+8801XXXXXXXXX"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Verification Code"}
                </Button>
              </form>
            </>
          )}

          {/* Step 2: Reset Password with OTP */}
          {currentStep === "reset" && (
            <>
              <div className="text-center">
                <h2 className="text-3xl ">Reset Your Password</h2>
                <p className="mt-2 text-muted-foreground">
                  We sent a 6-digit code to <strong>{mobile}</strong>
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="grid gap-4">
                <div className="space-y-2">
                  <Label>Verification Code</Label>
                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, index) => (
                      <Input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-12 text-center text-lg font-semibold"
                        required
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                    {showConfirmPassword ? (
                      <EyeIcon
                        className="absolute right-3 top-3 h-5 w-5 text-muted-foreground cursor-pointer"
                        onClick={() => setShowConfirmPassword(false)}
                      />
                    ) : (
                      <EyeOff
                        className="absolute right-3 top-3 h-5 w-5 text-muted-foreground cursor-pointer"
                        onClick={() => setShowConfirmPassword(true)}
                      />
                    )}
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={async () => {
                    setResending(true);
                    try {
                      const response =
                        await authService.forgotPasswordOtpSent(mobile);
                      toast.success(
                        response.message ||
                          "Verification code resent successfully!",
                      );
                    } catch (error: unknown) {
                      const apiError =
                        error &&
                        typeof error === "object" &&
                        "response" in error
                          ? (error as {
                              response?: { data?: { error_message?: string } };
                            })
                          : null;
                      toast.error(
                        apiError?.response?.data?.error_message ||
                          "Failed to resend code",
                      );
                    } finally {
                      setResending(false);
                    }
                  }}
                  className="w-full"
                  disabled={resending}
                >
                  {resending ? "Resending..." : "Resend Code"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
