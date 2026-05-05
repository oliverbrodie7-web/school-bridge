import { Link } from "react-router-dom";

const Parent = () => {
  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-12">
      <div className="w-full max-w-2xl">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </Link>

        <h1
          className="mt-6 text-3xl font-bold text-foreground sm:text-4xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          The Split Strategy
        </h1>
        <p className="mt-1 text-muted-foreground">A guide for parents</p>

        {/* SECTION 1 */}
        <Section title="What is the Split Strategy?">
          <p className="text-foreground/90 leading-relaxed">
            The split strategy is how your child's teacher is teaching addition right now. Instead of adding numbers the way most of us learned (stacking them and carrying the one), children are taught to <strong className="text-foreground">split numbers into their tens and ones first</strong>.
          </p>
        </Section>

        {/* SECTION 2 */}
        <Section title="Here's an example">
          <p className="mb-5 text-muted-foreground">
            Let's solve <strong className="text-foreground">34 + 52</strong> using the split strategy:
          </p>

          <div className="space-y-4">
            <StepRow
              number={1}
              text={<>Split <strong>34</strong> into <Tens>30</Tens> and <Ones>4</Ones></>}
            />
            <StepRow
              number={2}
              text={<>Split <strong>52</strong> into <Tens>50</Tens> and <Ones>2</Ones></>}
            />
            <StepRow
              number={3}
              text={<>Add the tens: <Tens>30</Tens> + <Tens>50</Tens> = <Tens>80</Tens></>}
            />
            <StepRow
              number={4}
              text={<>Add the ones: <Ones>4</Ones> + <Ones>2</Ones> = <Ones>6</Ones></>}
            />
            <StepRow
              number={5}
              text={<>Add the results: <Tens>80</Tens> + <Ones>6</Ones> = <Result>86</Result></>}
            />
          </div>
        </Section>

        {/* SECTION 3 */}
        <Section title="How to help at home">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <span className="text-foreground/90">Ask your child to say the tens and ones out loud before adding</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <span className="text-foreground/90">Use physical objects (coins, blocks) to show splitting</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <span className="text-foreground/90">Praise the process, not just the answer</span>
            </li>
          </ul>
        </Section>

        {/* SECTION 4 */}
        <div className="mt-10 text-center">
          <Link
            to="/student"
            className="inline-block rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try It Yourself
          </Link>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mt-10">
    <h2
      className="text-xl font-bold text-foreground sm:text-2xl"
      style={{ fontFamily: "var(--font-heading)" }}
    >
      {title}
    </h2>
    <div className="mt-4">{children}</div>
  </section>
);

const StepRow = ({ number, text }: { number: number; text: React.ReactNode }) => (
  <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
      {number}
    </span>
    <p className="font-medium text-foreground">{text}</p>
  </div>
);

const Tens = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block rounded-md bg-primary/15 px-1.5 py-0.5 font-bold text-primary">
    {children}
  </span>
);

const Ones = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block rounded-md bg-accent px-1.5 py-0.5 font-bold text-accent-foreground">
    {children}
  </span>
);

const Result = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block rounded-md bg-primary px-2 py-0.5 font-bold text-primary-foreground">
    {children}
  </span>
);

export default Parent;
