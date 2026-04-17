import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ULogo from "../assets/ULogo.png";

const INTERESTS = [
  "Hackathons",
  "Design",
  "Startups",
  "AI",
  "Marketing",
  "Photography",
  "Debates",
  "Research",
  "Web Dev",
  "Public Speaking",
  "Gaming",
  "Robotics"
];

const UNIVERSITIES = [
  "FAST NUCES",
  "LUMS",
  "IBA Karachi",
  "NUST",
  "NED University",
  "COMSATS"
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate"];

const ROLES = [
  {
    id: "student",
    title: "Student",
    description: "Discover events, meet people, and build your campus circle."
  },
  {
    id: "founder",
    title: "Founder",
    description: "Show what you are building and find collaborators early."
  },
  {
    id: "event_manager",
    title: "Event Manager",
    description: "Create polished event pages and manage registrations."
  }
];

const LANDING_FEATURES = [
  {
    emoji: "01",
    title: "Event Discovery",
    description: "Find the right event quickly through clearer listings, stronger context, and better structure."
  },
  {
    emoji: "02",
    title: "Founder's Launchpad",
    description: "Give student startups a place to present traction, attract collaborators, and stay visible on campus."
  },
  {
    emoji: "03",
    title: "Campus Networking",
    description: "Turn scattered browsing into better conversations, stronger connections, and real campus community."
  },
  {
    emoji: "04",
    title: "Smart Recommendations",
    description: "Shape the experience around your role, your interests, and the activity you actually care about."
  }
];

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];

function getStrength(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

function getStoredProfile() {
  const fallback = {
    fullName: "Campus User",
    email: "",
    role: "student",
    university: "",
    year: "",
    interests: [],
    bio: "",
    linkedin: "",
    github: "",
    avatarPreview: ""
  };

  try {
    return {
      ...fallback,
      ...JSON.parse(localStorage.getItem("uniconnect_user_profile") || "{}")
    };
  } catch {
    return fallback;
  }
}

function saveProfile(updates) {
  const next = { ...getStoredProfile(), ...updates };
  localStorage.setItem("uniconnect_user_profile", JSON.stringify(next));
  return next;
}

function completeDemoLogin(profile, onboardingComplete = false) {
  localStorage.setItem("uniconnect_token", "demo-token");
  localStorage.setItem("uniconnect_onboarding_complete", onboardingComplete ? "true" : "false");
  saveProfile(profile);
}

function AuthShell({ children, wide = false }) {
  return (
    <div className="auth-shell">
      <div className="auth-shell__backdrop" />
      <div className={`auth-shell__content${wide ? " auth-shell__content--wide" : ""}`}>{children}</div>
    </div>
  );
}

function AuthBrand() {
  return (
    <Link to="/" className="auth-brand">
      <span className="auth-brand__mark">
        <img src={ULogo} alt="UniConnect logo" />
      </span>
      <span className="auth-brand__text">UniConnect</span>
    </Link>
  );
}

function AuthPanel({ children, wide = false, subtle = false }) {
  return (
    <section className={`auth-panel${wide ? " auth-panel--wide" : ""}${subtle ? " auth-panel--subtle" : ""}`}>
      {children}
    </section>
  );
}

function AuthField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
  name
}) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <label className="auth-field">
      <span className="auth-field__label">{label}</span>
      <span className={`auth-field__control${error ? " auth-field__control--error" : ""}`}>
        <input
          name={name}
          type={isPassword && visible ? "text" : type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
        {isPassword ? (
          <button type="button" className="auth-field__toggle" onClick={() => setVisible((current) => !current)}>
            {visible ? "Hide" : "Show"}
          </button>
        ) : null}
      </span>
      {error ? <span className="auth-field__error">{error}</span> : null}
    </label>
  );
}

function AuthSelect({ label, value, onChange, options, placeholder }) {
  return (
    <label className="auth-field">
      <span className="auth-field__label">{label}</span>
      <span className="auth-field__control">
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}

function AuthTextarea({ label, value, onChange, placeholder, hint }) {
  return (
    <label className="auth-field">
      <span className="auth-field__label">{label}</span>
      <span className="auth-field__control auth-field__control--textarea">
        <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={4} />
      </span>
      {hint ? <span className="auth-field__hint">{hint}</span> : null}
    </label>
  );
}

function PrimaryButton({ children, type = "button", onClick, disabled, loading }) {
  return (
    <button type={type} className="auth-button auth-button--primary" onClick={onClick} disabled={disabled || loading}>
      {loading ? "Please wait..." : children}
    </button>
  );
}

function SecondaryButton({ children, type = "button", onClick, disabled }) {
  return (
    <button type={type} className="auth-button auth-button--secondary" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function PasswordStrength({ password }) {
  const score = getStrength(password);

  if (!password) {
    return null;
  }

  return (
    <div className="password-strength">
      <div className="password-strength__track">
        {[1, 2, 3, 4].map((segment) => (
          <span
            key={segment}
            className={`password-strength__segment${segment <= score ? " password-strength__segment--filled" : ""}`}
          />
        ))}
      </div>
      <span className="password-strength__label">{STRENGTH_LABELS[score]}</span>
    </div>
  );
}

function InterestPicker({ selected, onToggle }) {
  return (
    <div className="interest-picker">
      {INTERESTS.map((interest) => {
        const active = selected.includes(interest);

        return (
          <button
            key={interest}
            type="button"
            className={`interest-pill${active ? " interest-pill--active" : ""}`}
            onClick={() => onToggle(interest)}
          >
            {interest}
          </button>
        );
      })}
    </div>
  );
}

function StepDots({ current }) {
  return (
    <div className="onboarding-steps">
      {[1, 2, 3].map((step) => (
        <span key={step} className={`onboarding-steps__dot${current === step ? " active" : ""}`} />
      ))}
    </div>
  );
}

function LandingNavLink({ href, children }) {
  return (
    <a
      href={href}
      className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
    >
      {children}
    </a>
  );
}

function LandingFeatureCard({ feature }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-sm font-semibold text-white">
        {feature.emoji}
      </div>
      <h3 className="mb-2 text-lg font-semibold tracking-tight text-slate-950">{feature.title}</h3>
      <p className="text-sm leading-6 text-slate-600">{feature.description}</p>
    </article>
  );
}

function LandingStep({ number, title, description }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
      <p className="mb-3 text-sm font-semibold text-slate-500">{number}</p>
      <h3 className="mb-2 text-lg font-semibold tracking-tight text-slate-950">{title}</h3>
      <p className="text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}

function TestimonialCard({ quote, name, role }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
      <p className="mb-5 text-sm leading-6 text-slate-700">"{quote}"</p>
      <div>
        <p className="text-sm font-semibold text-slate-950">{name}</p>
        <p className="text-sm text-slate-500">{role}</p>
      </div>
    </article>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.08),transparent_58%)]" />

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img src={ULogo} alt="UniConnect logo" className="h-10 w-10 rounded-xl border border-slate-200 bg-white object-cover shadow-sm" />
          <span className="text-lg font-semibold tracking-tight text-slate-950">UniConnect</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <LandingNavLink href="#home">Home</LandingNavLink>
          <LandingNavLink href="#features">Features</LandingNavLink>
          <LandingNavLink href="#about">About</LandingNavLink>
          <LandingNavLink href="#contact">Contact</LandingNavLink>
        </nav>

        <Link
          to="/signup"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm shadow-slate-300 transition hover:bg-slate-800"
        >
          Get Started
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-24 px-6 pb-16 pt-6 lg:px-8">
        <section id="home" className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="max-w-2xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              One platform for campus life
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Discover events, people, and student ventures without the campus chaos.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              UniConnect gives students, founders, and organizers one clean place to explore what is happening, connect
              with the right people, and act quickly.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-6 text-sm font-semibold text-white shadow-sm shadow-slate-300 transition hover:bg-slate-800"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/70">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Campus Feed</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-950">Everything important, in one view</h2>
                </div>
                <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600">
                  Live
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Upcoming Event</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-950">Campus Founder Mixer</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Meet founders, builders, and operators in a more structured networking space.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-medium text-slate-500">Startup Spotlight</p>
                    <p className="mt-2 text-base font-semibold text-slate-950">PitchPilot</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Looking for a frontend collaborator.</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-medium text-slate-500">Society Update</p>
                    <p className="mt-2 text-base font-semibold text-slate-950">Creator Summit</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Volunteer roles opened this week.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="space-y-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Features</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Built to make campus activity feel clear, connected, and easy to trust.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {LANDING_FEATURES.map((feature) => (
              <LandingFeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </section>

        <section id="about" className="space-y-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">How It Works</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Three simple steps from discovery to action.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <LandingStep
              number="Step 1"
              title="Create your presence"
              description="Set up your role, interests, and profile so the experience starts with relevance."
            />
            <LandingStep
              number="Step 2"
              title="Explore what matters"
              description="Browse events, startups, and people through cleaner discovery surfaces."
            />
            <LandingStep
              number="Step 3"
              title="Join the momentum"
              description="Register, follow, connect, and return to one place instead of starting over."
            />
          </div>
        </section>

        <section className="space-y-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Testimonials</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Trusted by students and organizers who need less noise.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <TestimonialCard
              quote="It feels much easier to see which events are actually worth my time."
              name="Areeba Khan"
              role="Student Designer"
            />
            <TestimonialCard
              quote="Our event pages finally feel organized and credible instead of scattered."
              name="Sara Tariq"
              role="Society Lead"
            />
            <TestimonialCard
              quote="The startup visibility is strong enough that people actually reach out."
              name="Hamza Ali"
              role="Student Founder"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-950 px-8 py-14 text-center shadow-sm shadow-slate-300/60 sm:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">Get Started</p>
          <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Bring your campus community into one cleaner digital home.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Discover better events, make stronger connections, and keep the right activity in one place.
          </p>
          <div className="mt-8">
            <Link
              to="/signup"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Create Your Account
            </Link>
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <img src={ULogo} alt="UniConnect logo" className="h-9 w-9 rounded-lg border border-slate-200 object-cover" />
            <span className="font-medium text-slate-700">UniConnect</span>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <a href="#home" className="hover:text-slate-950">Home</a>
            <a href="#features" className="hover:text-slate-950">Features</a>
            <a href="#about" className="hover:text-slate-950">About</a>
            <a href="#contact" className="hover:text-slate-950">Contact</a>
          </div>
          <p>© 2026 UniConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    }

    if (!form.password) {
      nextErrors.password = "Password is required.";
    }

    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (form.email.toLowerCase().includes("fail")) {
      setErrors({ general: "Invalid email or password." });
      setLoading(false);
      return;
    }

    completeDemoLogin(
      {
        email: form.email,
        fullName: "Zara Ahmed",
        role: "student",
        university: "IBA Karachi",
        interests: ["Hackathons", "Startups", "Design"]
      },
      true
    );

    setLoading(false);
    navigate("/home");
  }

  return (
    <AuthShell>
      <AuthPanel subtle>
        <AuthBrand />
        <div className="auth-panel__header">
          <p className="auth-panel__eyebrow">Welcome back</p>
          <h1>Login to UniConnect</h1>
          <p>Pick up where you left off and get back into your campus feed.</p>
        </div>

        {errors.general ? <p className="auth-message auth-message--error">{errors.general}</p> : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          <AuthField
            label="Email"
            type="email"
            value={form.email}
            onChange={(value) => setForm((current) => ({ ...current, email: value }))}
            placeholder="you@university.edu"
            error={errors.email}
            autoComplete="email"
          />
          <AuthField
            label="Password"
            type="password"
            value={form.password}
            onChange={(value) => setForm((current) => ({ ...current, password: value }))}
            placeholder="Enter your password"
            error={errors.password}
            autoComplete="current-password"
          />

          <div className="auth-row auth-row--end">
            <Link to="/forgot-password" className="auth-inline-link">
              Forgot Password
            </Link>
          </div>

          <PrimaryButton type="submit" loading={loading}>
            Login
          </PrimaryButton>
        </form>

        <p className="auth-footer-note">
          Do not have an account?{" "}
          <Link to="/signup" className="auth-inline-link">
            Sign Up
          </Link>
        </p>
      </AuthPanel>
    </AuthShell>
  );
}

export function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    university: "",
    year: "",
    role: "",
    interests: [],
    terms: false
  });

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleInterest(interest) {
    setForm((current) => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest]
    }));
  }

  function validate() {
    const nextErrors = {};

    if (!form.fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    if (!form.password) nextErrors.password = "Password is required.";
    if (form.password && form.password.length < 8) nextErrors.password = "Use at least 8 characters.";
    if (!form.confirmPassword) nextErrors.confirmPassword = "Confirm your password.";
    if (form.confirmPassword && form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }
    if (!form.university) nextErrors.university = "Select your university.";
    if (!form.year) nextErrors.year = "Select your year of study.";
    if (!form.role) nextErrors.role = "Choose a role.";
    if (form.interests.length < 3) nextErrors.interests = "Select at least 3 interests.";
    if (!form.terms) nextErrors.terms = "You must agree to the terms.";

    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    completeDemoLogin(
      {
        fullName: form.fullName,
        email: form.email,
        role: form.role,
        university: form.university,
        year: form.year,
        interests: form.interests
      },
      false
    );

    setLoading(false);
    navigate("/onboarding");
  }

  return (
    <AuthShell wide>
      <AuthPanel wide>
        <AuthBrand />
        <div className="auth-panel__header">
          <p className="auth-panel__eyebrow">Create your account</p>
          <h1>Join the campus network</h1>
          <p>A polished start matters, so this form keeps everything in one place and easy to scan.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-grid auth-grid--2">
            <AuthField
              label="Full Name"
              value={form.fullName}
              onChange={(value) => setField("fullName", value)}
              placeholder="Your full name"
              error={errors.fullName}
              autoComplete="name"
            />
            <AuthField
              label="Email"
              type="email"
              value={form.email}
              onChange={(value) => setField("email", value)}
              placeholder="you@university.edu"
              error={errors.email}
              autoComplete="email"
            />
          </div>

          <div className="auth-grid auth-grid--2">
            <div>
              <AuthField
                label="Password"
                type="password"
                value={form.password}
                onChange={(value) => setField("password", value)}
                placeholder="Create a password"
                error={errors.password}
                autoComplete="new-password"
              />
              <PasswordStrength password={form.password} />
            </div>

            <AuthField
              label="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={(value) => setField("confirmPassword", value)}
              placeholder="Repeat your password"
              error={errors.confirmPassword}
              autoComplete="new-password"
            />
          </div>

          <div className="auth-grid auth-grid--2">
            <AuthSelect
              label="University"
              value={form.university}
              onChange={(value) => setField("university", value)}
              options={UNIVERSITIES}
              placeholder="Select university"
            />
            <AuthSelect
              label="Year of Study"
              value={form.year}
              onChange={(value) => setField("year", value)}
              options={YEARS}
              placeholder="Select year"
            />
          </div>

          {errors.university || errors.year ? (
            <p className="auth-message auth-message--error">{errors.university || errors.year}</p>
          ) : null}

          <div className="auth-section">
            <div className="auth-section__head">
              <div>
                <p className="auth-section__eyebrow">Choose your role</p>
                <h2>Select the experience that fits you</h2>
              </div>
            </div>
            <div className="role-selector">
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  className={`role-card${form.role === role.id ? " role-card--active" : ""}`}
                  onClick={() => setField("role", role.id)}
                >
                  <strong>{role.title}</strong>
                  <span>{role.description}</span>
                </button>
              ))}
            </div>
            {errors.role ? <p className="auth-message auth-message--error">{errors.role}</p> : null}
          </div>

          <div className="auth-section">
            <div className="auth-section__head">
              <div>
                <p className="auth-section__eyebrow">Interests</p>
                <h2>Pick at least three</h2>
              </div>
              <span className="auth-counter">{form.interests.length} selected</span>
            </div>
            <InterestPicker selected={form.interests} onToggle={toggleInterest} />
            {errors.interests ? <p className="auth-message auth-message--error">{errors.interests}</p> : null}
          </div>

          <label className="terms-check">
            <input type="checkbox" checked={form.terms} onChange={(event) => setField("terms", event.target.checked)} />
            <span>I agree to the Terms and Privacy Policy.</span>
          </label>
          {errors.terms ? <p className="auth-message auth-message--error">{errors.terms}</p> : null}

          <PrimaryButton type="submit" loading={loading}>
            Sign Up
          </PrimaryButton>
        </form>

        <p className="auth-footer-note">
          Already have an account?{" "}
          <Link to="/login" className="auth-inline-link">
            Login
          </Link>
        </p>
      </AuthPanel>
    </AuthShell>
  );
}

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setLoading(false);
    setState(email.toLowerCase().includes("missing") ? "error" : "success");
  }

  return (
    <AuthShell>
      <AuthPanel subtle>
        <AuthBrand />
        <div className="auth-panel__header">
          <p className="auth-panel__eyebrow">Forgot password</p>
          <h1>Reset your password</h1>
          <p>Enter your email and we will send you a reset link.</p>
        </div>

        {state === "success" ? (
          <div className="auth-status-card auth-status-card--success">
            <h2>Check your inbox</h2>
            <p>
              We sent a reset link to <strong>{email}</strong>.
            </p>
          </div>
        ) : null}

        {state === "error" ? (
          <div className="auth-status-card auth-status-card--error">
            <h2>No account found</h2>
            <p>We could not find an account with that email address.</p>
          </div>
        ) : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          <AuthField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@university.edu"
            autoComplete="email"
          />
          <PrimaryButton type="submit" loading={loading}>
            Send Reset Link
          </PrimaryButton>
        </form>

        <p className="auth-footer-note">
          <Link to="/login" className="auth-inline-link">
            Back to Login
          </Link>
        </p>
      </AuthPanel>
    </AuthShell>
  );
}

export function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const linkExpired = !token || token.toLowerCase() === "expired";

  useEffect(() => {
    if (!done) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          navigate("/login");
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [done, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.password || form.password !== form.confirmPassword) {
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setLoading(false);
    setDone(true);
  }

  return (
    <AuthShell>
      <AuthPanel subtle>
        <AuthBrand />

        {linkExpired ? (
          <div className="auth-status-card auth-status-card--error">
            <h2>Expired reset link</h2>
            <p>This password reset link is invalid or has expired.</p>
            <Link to="/forgot-password" className="auth-inline-link">
              Request another reset link
            </Link>
          </div>
        ) : done ? (
          <div className="auth-status-card auth-status-card--success">
            <h2>Password updated</h2>
            <p>Redirecting you to login in {countdown} seconds.</p>
          </div>
        ) : (
          <>
            <div className="auth-panel__header">
              <p className="auth-panel__eyebrow">Reset password</p>
              <h1>Create a new password</h1>
              <p>Use a strong password you have not used before.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div>
                <AuthField
                  label="New Password"
                  type="password"
                  value={form.password}
                  onChange={(value) => setForm((current) => ({ ...current, password: value }))}
                  placeholder="Create a strong password"
                />
                <PasswordStrength password={form.password} />
              </div>

              <AuthField
                label="Confirm Password"
                type="password"
                value={form.confirmPassword}
                onChange={(value) => setForm((current) => ({ ...current, confirmPassword: value }))}
                placeholder="Repeat your password"
              />

              {form.confirmPassword && form.confirmPassword !== form.password ? (
                <p className="auth-message auth-message--error">Passwords do not match.</p>
              ) : null}

              <PrimaryButton type="submit" loading={loading}>
                Reset Password
              </PrimaryButton>
            </form>
          </>
        )}
      </AuthPanel>
    </AuthShell>
  );
}

export function EmailVerify() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setStatus(!token || token.toLowerCase() === "expired" ? "error" : "success");
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [token]);

  return (
    <AuthShell>
      <AuthPanel subtle>
        <AuthBrand />

        {status === "loading" ? (
          <div className="auth-status-card">
            <div className="auth-loader" />
            <h2>Verifying your email</h2>
            <p>Please wait while we confirm your account.</p>
          </div>
        ) : null}

        {status === "success" ? (
          <div className="auth-status-card auth-status-card--success">
            <h2>Email verified</h2>
            <p>Your account is ready to go.</p>
            <PrimaryButton onClick={() => navigate("/home")}>Go to Home</PrimaryButton>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="auth-status-card auth-status-card--error">
            <h2>Invalid or expired link</h2>
            <p>This verification link can no longer be used.</p>
            <SecondaryButton onClick={() => navigate("/signup")}>Resend Verification</SecondaryButton>
          </div>
        ) : null}
      </AuthPanel>
    </AuthShell>
  );
}

export function OnboardingPage() {
  const navigate = useNavigate();
  const storedProfile = useMemo(() => getStoredProfile(), []);
  const firstName = storedProfile.fullName.split(" ")[0] || "there";
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState(storedProfile.interests || []);
  const [profile, setProfile] = useState({
    university: storedProfile.university || "",
    year: storedProfile.year || "",
    bio: storedProfile.bio || "",
    linkedin: storedProfile.linkedin || "",
    github: storedProfile.github || "",
    avatarPreview: storedProfile.avatarPreview || ""
  });

  function toggleInterest(interest) {
    setInterests((current) =>
      current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest]
    );
  }

  function handleAvatarChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfile((current) => ({ ...current, avatarPreview: reader.result }));
    };
    reader.readAsDataURL(file);
  }

  function finishSetup() {
    saveProfile({
      ...storedProfile,
      ...profile,
      interests
    });
    localStorage.setItem("uniconnect_onboarding_complete", "true");
    navigate("/home");
  }

  return (
    <AuthShell>
      <AuthPanel>
        <AuthBrand />
        <StepDots current={step} />

        {step === 1 ? (
          <div className="onboarding-screen">
            <div className="auth-panel__header">
              <p className="auth-panel__eyebrow">Step 1 of 3</p>
              <h1>Welcome, {firstName}</h1>
              <p>Let us set up your account so your first session already feels personal and complete.</p>
            </div>
            <PrimaryButton onClick={() => setStep(2)}>Let's Get Started</PrimaryButton>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="onboarding-screen">
            <div className="auth-section__head">
              <div>
                <p className="auth-panel__eyebrow">Step 2 of 3</p>
                <h2>Choose your interests</h2>
              </div>
              <span className="auth-counter">{interests.length} selected</span>
            </div>
            <InterestPicker selected={interests} onToggle={toggleInterest} />
            <p className="auth-field__hint">Select at least 3 to continue, or skip for now.</p>
            <div className="auth-row">
              <SecondaryButton onClick={() => navigate("/home")}>Skip</SecondaryButton>
              <PrimaryButton onClick={() => setStep(3)} disabled={interests.length < 3}>
                Continue
              </PrimaryButton>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="onboarding-screen">
            <div className="auth-panel__header">
              <p className="auth-panel__eyebrow">Step 3 of 3</p>
              <h1>Complete your profile</h1>
              <p>These details help other students understand who you are and what you care about.</p>
            </div>

            <div className="avatar-upload">
              <div className="avatar-upload__preview">
                {profile.avatarPreview ? <img src={profile.avatarPreview} alt="Avatar preview" /> : <span>{firstName[0]}</span>}
              </div>
              <label className="avatar-upload__action">
                <span>Upload avatar</span>
                <input type="file" accept="image/*" onChange={handleAvatarChange} />
              </label>
            </div>

            <div className="auth-grid auth-grid--2">
              <AuthSelect
                label="University"
                value={profile.university}
                onChange={(value) => setProfile((current) => ({ ...current, university: value }))}
                options={UNIVERSITIES}
                placeholder="Select university"
              />
              <AuthSelect
                label="Year of Study"
                value={profile.year}
                onChange={(value) => setProfile((current) => ({ ...current, year: value }))}
                options={YEARS}
                placeholder="Select year"
              />
            </div>

            <AuthTextarea
              label="Bio"
              value={profile.bio}
              onChange={(value) => setProfile((current) => ({ ...current, bio: value.slice(0, 160) }))}
              placeholder="Tell people a little about yourself"
              hint={`${profile.bio.length}/160 characters`}
            />

            <div className="auth-grid auth-grid--2">
              <AuthField
                label="LinkedIn"
                value={profile.linkedin}
                onChange={(value) => setProfile((current) => ({ ...current, linkedin: value }))}
                placeholder="linkedin.com/in/username"
              />
              <AuthField
                label="GitHub"
                value={profile.github}
                onChange={(value) => setProfile((current) => ({ ...current, github: value }))}
                placeholder="github.com/username"
              />
            </div>

            <div className="auth-row">
              <SecondaryButton onClick={() => navigate("/home")}>Skip</SecondaryButton>
              <PrimaryButton onClick={finishSetup}>Finish Setup</PrimaryButton>
            </div>
          </div>
        ) : null}
      </AuthPanel>
    </AuthShell>
  );
}
