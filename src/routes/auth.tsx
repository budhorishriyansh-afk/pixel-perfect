import React, { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "../components/storefront/Header";
import { Footer } from "../components/storefront/Footer";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const { signIn, signUp, user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (isRegister) {
      await signUp(email, fullName || "Studio Patron");
      toast.success("Account created successfully!");
      navigate({ to: "/account" });
    } else {
      await signIn(email);
      toast.success("Signed in successfully!");
      navigate({ to: "/account" });
    }
  };

  const handleQuickDemoAdmin = async () => {
    await signIn("admin@tester.com", "admin");
    toast.success("Logged in as Studio Administrator!");
    navigate({ to: "/admin" });
  };

  const handleQuickDemoCustomer = async () => {
    await signIn("client@tester.com", "customer");
    toast.success("Logged in as Private Client!");
    navigate({ to: "/account" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf8] text-[#22201d]">
      <Header />

      <main className="flex-1 max-w-md mx-auto w-full px-6 py-16 sm:py-24">
        {user ? (
          <div className="text-center bg-white p-8 border border-[#e4ded0] rounded-[2px] shadow-sm">
            <h2 className="font-serif text-2xl font-light text-[#1b1916] mb-2">
              Currently Signed In
            </h2>
            <p className="text-xs text-[#6e6353] font-light mb-6">
              You are signed in as <strong>{user.email}</strong> ({user.role}).
            </p>
            <div className="space-y-3">
              <Link
                to="/account"
                className="block w-full py-3 bg-[#1e1c19] text-[#f7f5f0] text-xs font-sans uppercase tracking-[0.2em] font-medium"
              >
                Go to Account
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="block w-full py-3 bg-[#7b2c2c] text-[#f7f5f0] text-xs font-sans uppercase tracking-[0.2em] font-medium"
                >
                  Go to Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="w-full py-2.5 border border-[#ded7c9] text-xs font-sans uppercase tracking-wider text-[#a32828] hover:bg-[#fcf7f7]"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 sm:p-10 border border-[#e4ded0] rounded-[2px] shadow-sm">
            <div className="text-center mb-8">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#887f70] font-sans font-medium block mb-2">
                ATELIER PASS
              </span>
              <h2 className="font-serif text-3xl font-light text-[#1b1916]">
                {isRegister ? "Create Studio Account" : "Client Sign In"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              {isRegister && (
                <div>
                  <label className="block text-[#6a6050] uppercase tracking-wider text-[10px] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Julian Sterling"
                    className="w-full bg-[#fdfcf9] border border-[#ded7ca] px-3.5 py-2.5 rounded-[1px] focus:outline-none focus:border-black"
                  />
                </div>
              )}

              <div>
                <label className="block text-[#6a6050] uppercase tracking-wider text-[10px] mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@tester.com"
                  className="w-full bg-[#fdfcf9] border border-[#ded7ca] px-3.5 py-2.5 rounded-[1px] focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[#6a6050] uppercase tracking-wider text-[10px] mb-1.5">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#fdfcf9] border border-[#ded7ca] px-3.5 py-2.5 rounded-[1px] focus:outline-none focus:border-black"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#1f1d1a] hover:bg-black text-[#f7f5f0] text-xs font-sans tracking-[0.22em] uppercase font-medium rounded-[1px] transition-colors mt-2"
              >
                {isRegister ? "CREATE ACCOUNT" : "SIGN IN"}
              </button>
            </form>

            <div className="mt-6 text-center text-xs font-sans text-[#6e6353]">
              {isRegister ? (
                <span>
                  Already an atelier patron?{" "}
                  <button
                    onClick={() => setIsRegister(false)}
                    className="underline text-black font-medium"
                  >
                    Sign In
                  </button>
                </span>
              ) : (
                <span>
                  New to TESTER?{" "}
                  <button
                    onClick={() => setIsRegister(true)}
                    className="underline text-black font-medium"
                  >
                    Register
                  </button>
                </span>
              )}
            </div>

            {/* Quick Demo Login Bar for pairs & testing */}
            <div className="mt-8 pt-6 border-t border-[#ece7dc] text-center">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#887e6d] block mb-3">
                Quick Development Access
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleQuickDemoCustomer}
                  className="flex-1 py-2 border border-[#ded8cb] bg-[#f7f5ee] hover:bg-[#ede8dc] text-[10px] uppercase tracking-wider text-[#353028]"
                >
                  Demo Client
                </button>
                <button
                  type="button"
                  onClick={handleQuickDemoAdmin}
                  className="flex-1 py-2 border border-[#ded8cb] bg-[#23201d] text-[#f7f5f0] hover:bg-black text-[10px] uppercase tracking-wider font-medium"
                >
                  Demo Admin
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
