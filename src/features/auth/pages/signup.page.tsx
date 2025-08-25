import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context";
import { handleApiError } from "@/lib/error-handle";
import { Link, useNavigate } from "@tanstack/react-router";
import { Input, notification } from "antd";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon } from "lucide-react";
import { useState } from "react";

export function SignupPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [loginFormData, setLoginFormData] = useState({ email: "", name: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignupSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const dto = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    if (dto.password !== dto.confirmPassword) {
      return notification.error({
        message: "The password you entered does not match",
      });
    }
    if (dto.name === "" || dto.email === "" || dto.password === "" || dto.confirmPassword === "") {
      return notification.error({
        message: "Please fill in the information completely",
      });
    }

    await auth.signupMutation.mutateAsync(dto)
      .catch((error: any) => {
        handleApiError(error, {
          customMessage: "Signup failed",
          skipGlobal: true,
        });
      });

    navigate({
      to: "/dashboard",
      search: {
        isFromLogin: true,
      },
    });
  };

  const loading = auth.signupMutation.isPending;

  return (
    <form onSubmit={handleSignupSubmit} className="rounded-lg p-8 w-full max-w-lg">
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
            value={loginFormData.email}
            onChange={handleLoginInputChange}
            name="email"
          />
        </div>
        <div>
          <label className="mb-2">Name</label>
          <Input
            placeholder="Name"
            className="border-0 focus-visible:ring-0 shadow-none h-10 mt-2"
            prefix={<UserIcon className="h-5 w-5 text-muted-foreground" />}
            value={loginFormData.name}
            onChange={handleLoginInputChange}
            name="name"
          />
        </div>
        <div>
          <label className="mb-2">Password</label>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="border-0 focus-visible:ring-0 shadow-none h-10 mt-2"
            prefix={<LockIcon className="h-5 w-5 text-muted-foreground" />}
            suffix={showPassword ? <EyeOffIcon onClick={togglePasswordVisibility} className="h-5 w-5 text-muted-foreground" /> : <EyeIcon onClick={togglePasswordVisibility} className="h-5 w-5 text-muted-foreground" />}
            value={loginFormData.password}
            onChange={handleLoginInputChange}
            name="password"
          />
        </div>
        <div>
          <label className="mb-2">Confirm Password</label>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="border-0 focus-visible:ring-0 shadow-none h-10 mt-2"
            prefix={<LockIcon className="h-5 w-5 text-muted-foreground" />}
            suffix={showPassword ? <EyeOffIcon onClick={togglePasswordVisibility} className="h-5 w-5 text-muted-foreground" /> : <EyeIcon onClick={togglePasswordVisibility} className="h-5 w-5 text-muted-foreground" />}
            value={loginFormData.confirmPassword}
            onChange={handleLoginInputChange}
            name="confirmPassword"
          />
        </div>
        <div className="mb-8">
          <Button className="w-full" disabled={loading}>Sign Up</Button>
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
