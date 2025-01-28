import { useState } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { API_FUNCTIONS } from "@/lib/api";

interface SignUpForm {
  email: string;
  name: string;
  organizationName: string;
  password: string;
  confirmPassword: string;
}

const INITIAL_FORM_STATE: SignUpForm = {
  email: "",
  name: "",
  organizationName: "",
  password: "",
  confirmPassword: "",
};

const SignUp = () => {
  const history = useNavigate();
  const [formData, setFormData] = useState<SignUpForm>(INITIAL_FORM_STATE);
  const [step, setStep] = useState<'email' | 'otp' | 'details'>('email');
  const [otp, setOtp] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Please enter your email");
      return;
    }

    const { data, err } = await API_FUNCTIONS.sendOTP(formData.email);
    if (!err) {
      toast.success("Verification code sent to your email!");
      setStep('otp');
    } else {
      toast.error(err.message || "Failed to send verification code");
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the verification code");
      return;
    }

    const { data, err } = await API_FUNCTIONS.verifyOTP(formData.email, otp);
    if (!err) {
      toast.success("Email verified successfully!");
      setStep('details');
    } else {
      toast.error(err.message || "Invalid verification code");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const { data, err } = await API_FUNCTIONS.register(
      formData.email,
      formData.password,
      formData.name,
      formData.organizationName
    );

    if (!err) {
      toast.success("Account created successfully!");
      setFormData(INITIAL_FORM_STATE);
      history("/login");
    } else {
      toast.error(err.message || "Failed to create account");
    }
  };

  const renderEmailStep = () => (
    <form onSubmit={handleSendOTP}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full">
          Continue with Email
        </Button>
      </CardFooter>
    </form>
  );

  const renderOTPStep = () => (
    <form onSubmit={handleVerifyOTP}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Verification Code</Label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={6}
            pattern="[0-9]{6}"
          />
          <p className="text-sm text-gray-500">
            Enter the verification code sent to {formData.email}
          </p>
        </div>
        <Button
          type="button"
          variant="link"
          className="p-0 h-auto"
          onClick={handleSendOTP}
        >
          Resend Code
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button type="submit" className="w-full">
          Verify Code
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => setStep('email')}
        >
          Change Email
        </Button>
      </CardFooter>
    </form>
  );

  const renderDetailsStep = () => (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="organizationName">Organization Name</Label>
          <Input
            id="organizationName"
            name="organizationName"
            type="text"
            value={formData.organizationName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button type="submit" className="w-full">
          Create Account
        </Button>
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </CardFooter>
    </form>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            {step === 'email' && "Enter your email to get started"}
            {step === 'otp' && "Verify your email address"}
            {step === 'details' && "Complete your account setup"}
          </CardDescription>
        </CardHeader>
        {step === 'email' && renderEmailStep()}
        {step === 'otp' && renderOTPStep()}
        {step === 'details' && renderDetailsStep()}
      </Card>
    </div>
  );
};

export default SignUp;