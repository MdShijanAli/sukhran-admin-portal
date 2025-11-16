import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Lock, Mail, Phone } from "lucide-react";
import apiClient from "@/api/apiClient";
import { apiRoutes } from "@/api/apiRoutes";
import authService from "@/services/authService";

type Step = "request" | "verify" | "reset";

export default function ForgotPassword() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Step management
  const [currentStep, setCurrentStep] = useState<Step>("request");
  const [loading, setLoading] = useState(false);

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
      const response = await authService.forgotPassword(mobile);

      console.log("OTP request response:", response.data);
      toast.success("Verification code sent successfully!");
      setCurrentStep("verify");
    } catch (error: any) {
      console.error("OTP request error:", error);
      toast.error(
        error?.response?.data?.error_message ||
          "Failed to send verification code"
      );
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post(apiRoutes.auth.verifyOTP, {
        email_or_mobile: mobile,
        otp: otpCode,
      });

      console.log("OTP verify response:", response.data);
      toast.success("Code verified successfully!");
      setCurrentStep("reset");
    } catch (error: unknown) {
      console.error("OTP verify error:", error);
      const message =
        error instanceof Error ? error.message : "Invalid verification code";
      const apiError =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } })
          : null;
      toast.error(apiError?.response?.data?.message || message);
    } finally {
      setLoading(false);
    }
  };

  // Reset Password
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      const response = await apiClient.post(apiRoutes.auth.resetPassword, {
        email_or_mobile: mobile,
        otp: otp.join(""),
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      console.log("Reset password response:", response.data);
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (error: unknown) {
      console.error("Reset password error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to reset password";
      const apiError =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } })
          : null;
      toast.error(apiError?.response?.data?.message || message);
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
    e: React.KeyboardEvent<HTMLInputElement>
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
              src={
                i18n.language === "en"
                  ? "/images/Skr-eng.png"
                  : "/images/Skr-bng.png"
              }
              alt="Shukran logo"
              className="w-40 h-auto object-contain"
            />
          </div>
          <h1 className="text-5xl font-bold mb-6">Password Recovery</h1>
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
                <h2 className="text-3xl font-bold">Forgot Password?</h2>
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

          {/* Step 2: Verify OTP */}
          {currentStep === "verify" && (
            <>
              <div className="text-center">
                <h2 className="text-3xl font-bold">Enter Verification Code</h2>
                <p className="mt-2 text-muted-foreground">
                  We sent a 6-digit code to
                </p>
                <p className="mt-1 font-medium text-foreground">{mobile}</p>
              </div>

              <form onSubmit={handleVerifyOTP} className="grid gap-6">
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

                <div className="flex flex-col gap-2">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Verifying..." : "Verify Code"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setCurrentStep("request")}
                    className="w-full"
                  >
                    Resend Code
                  </Button>
                </div>
              </form>
            </>
          )}

          {/* Step 3: Reset Password */}
          {currentStep === "reset" && (
            <>
              <div className="text-center">
                <h2 className="text-3xl font-bold">Create New Password</h2>
                <p className="mt-2 text-muted-foreground">
                  Enter your new password below
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
