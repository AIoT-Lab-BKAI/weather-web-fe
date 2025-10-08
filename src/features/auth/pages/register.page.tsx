import { Button } from "@/components/ui/button";
import { handleApiError } from "@/lib/error-handle";
import { Link, useNavigate } from "@tanstack/react-router";
import { Input, notification } from "antd";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { registerApi } from "../apis/auth.api";
import { useAuth } from "@/features/auth/hooks/use-auth";

// Validation schema
const registerSchema = z.object({
  name: z.string()
    .min(0)
    .max(50, "Name must not exceed 50 characters"),
  email: z.email()
    .min(1, "Email is required")
    .max(255, "Email must not exceed 255 characters"),
  password: z.string()
    .min(1, "Password is required"),
  confirmPassword: z.string()
    .min(1, "Please confirm your password"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { login } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRegisterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Clear previous errors
    setFieldErrors({});

    // Validate form data using Zod
    const validationResult = registerSchema.safeParse(formData);

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!errors[field]) {
          errors[field] = issue.message;
        }
      });

      setFieldErrors(errors);

      // Show a summary notification for validation errors
      const errorCount = Object.keys(errors).length;
      notification.error({
        message: "Validation Error",
        description: `Please fix ${errorCount} error${errorCount > 1 ? "s" : ""} in the form before submitting.`,
        duration: 5,
      });

      return;
    }

    setIsRegisterLoading(true);
    try {
      await login(() => registerApi({
        email: validationResult.data.email,
        password: validationResult.data.password,
      }));

      notification.success({
        message: "Registration Successful",
        description: "Welcome! Your account has been created successfully.",
        duration: 4,
      });

      navigate({ to: "/admin" });
    }
    catch (error: any) {
      return handleApiError(error, {
        customMessage: "Registration Failed",
        fallbackMessage: "Unable to create your account. Please check your information and try again.",
        skipGlobal: true,
      });
    }
    finally {
      setIsRegisterLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegisterSubmit} className="rounded-lg p-8 w-full max-w-lg">
      <div className="mb-14 flex items-center justify-center">
        <h2 className="text-4xl">Sign Up</h2>
      </div>
      <div className="w-full max-w-lg space-y-4">
        <div>
          <label className="mb-2">Email</label>
          <Input
            placeholder="Email"
            className="border-0 focus-visible:ring-0 shadow-none h-10 mt-2"
            prefix={<MailIcon className="h-5 w-5 text-muted-foreground" />}
            value={formData.email}
            onChange={handleInputChange}
            name="email"
            status={fieldErrors.email ? "error" : ""}
          />
          {fieldErrors.email && (
            <div className="text-red-500 text-sm mt-1">{fieldErrors.email}</div>
          )}
        </div>
        <div>
          <label className="mb-2">Name</label>
          <Input
            placeholder="Name"
            className="border-0 focus-visible:ring-0 shadow-none h-10 mt-2"
            prefix={<UserIcon className="h-5 w-5 text-muted-foreground" />}
            value={formData.name}
            onChange={handleInputChange}
            name="name"
            status={fieldErrors.name ? "error" : ""}
          />
          {fieldErrors.name && (
            <div className="text-red-500 text-sm mt-1">{fieldErrors.name}</div>
          )}
        </div>
        <div>
          <label className="mb-2">Password</label>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="border-0 focus-visible:ring-0 shadow-none h-10 mt-2"
            prefix={<LockIcon className="h-5 w-5 text-muted-foreground" />}
            suffix={showPassword ? <EyeOffIcon onClick={togglePasswordVisibility} className="h-5 w-5 text-muted-foreground cursor-pointer" /> : <EyeIcon onClick={togglePasswordVisibility} className="h-5 w-5 text-muted-foreground cursor-pointer" />}
            value={formData.password}
            onChange={handleInputChange}
            name="password"
            status={fieldErrors.password ? "error" : ""}
          />
          {fieldErrors.password && (
            <div className="text-red-500 text-sm mt-1">{fieldErrors.password}</div>
          )}
        </div>
        <div>
          <label className="mb-2">Confirm Password</label>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="border-0 focus-visible:ring-0 shadow-none h-10 mt-2"
            prefix={<LockIcon className="h-5 w-5 text-muted-foreground" />}
            suffix={showPassword ? <EyeOffIcon onClick={togglePasswordVisibility} className="h-5 w-5 text-muted-foreground cursor-pointer" /> : <EyeIcon onClick={togglePasswordVisibility} className="h-5 w-5 text-muted-foreground cursor-pointer" />}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            name="confirmPassword"
            status={fieldErrors.confirmPassword ? "error" : ""}
          />
          {fieldErrors.confirmPassword && (
            <div className="text-red-500 text-sm mt-1">{fieldErrors.confirmPassword}</div>
          )}
        </div>
        <div className="mb-8">
          <Button
            type="submit"
            className="w-full"
            disabled={isRegisterLoading}
          >
            {isRegisterLoading ? "Creating Account..." : "Sign Up"}
          </Button>
        </div>
        <div className="flex flex-col items-center mt-12">
          <div>Already have an account?</div>
          <Link to="/login">
            <Button variant="link">Login</Button>
          </Link>
        </div>
      </div>
    </form>
  );
}
