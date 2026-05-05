const Index = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl" style={{ fontFamily: 'var(--font-heading)' }}>
          The place between school and home.
        </h1>

        <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
          We help Year 2 students practise maths the way their teacher teaches it — and help parents understand it too.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button className="rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            I'm a Student
          </button>
          <button className="rounded-xl border-2 border-primary px-8 py-4 text-lg font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
            I'm a Parent
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
