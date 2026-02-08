// app/blog/test-the-blog/page.jsx
export const metadata = {
  title: "Test Blog Route | Barracks Media",
  description: "This is a hardcoded test route to confirm nested blog routing works.",
};

export default function TestBlogRoute() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-5 py-12">
        <h1 className="text-3xl font-bold text-white">✅ Blog child routes work</h1>
        <p className="mt-3 text-white/80">
          If you can see this page at <strong>/blog/test-the-blog</strong>, your routing is fine.
          Then the issue is specifically with the dynamic folder route name or placement.
        </p>
      </div>
    </main>
  );
}
