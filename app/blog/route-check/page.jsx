// app/blog/route-check/page.jsx
export const metadata = {
  title: "Route Check | Barracks Media",
  description: "Confirms that nested /blog routes are deploying correctly.",
};

export default function RouteCheck() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-5 py-12 text-white">
        <h1 className="text-3xl font-bold">✅ /blog child routes are deploying</h1>
        <p className="mt-3 text-white/80">
          If you can see this at <strong>/blog/route-check</strong>, the deploy contains nested routes.
        </p>
      </div>
    </main>
  );
}
