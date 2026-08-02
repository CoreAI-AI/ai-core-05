import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Search, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { downloadCSV, formatPosition, toCSV, type WaitlistRow } from "@/lib/waitlist";

const AdminWaitlist = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminCheck(user?.id);
  const [rows, setRows] = useState<WaitlistRow[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminLoading && !isAdmin && user) {
      toast.error("Access denied: Admin only");
      navigate("/");
    }
  }, [adminLoading, isAdmin, user, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("waitlist")
        .select("id, name, email, country, use_case, created_at")
        .order("created_at", { ascending: true });
      if (error) {
        toast.error("Failed to load waitlist entries");
      } else {
        setRows((data ?? []) as WaitlistRow[]);
      }
      setLoading(false);
    };
    load();
  }, [isAdmin]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) =>
      [row.name, row.email, row.country, row.use_case]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(term))
    );
  }, [rows, query]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("waitlist").delete().eq("id", id);
    if (error) {
      toast.error("Could not delete entry");
      return;
    }
    setRows((prev) => prev.filter((row) => row.id !== id));
    toast.success("Entry removed");
  };

  const handleExport = () => {
    downloadCSV(`coreai-waitlist-${new Date().toISOString().slice(0, 10)}.csv`, toCSV(rows));
    toast.success("CSV exported");
  };

  if (adminLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-4 p-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" /> Admin
          </Button>
          <h1 className="text-xl font-bold">Waitlist</h1>
          <Button size="sm" className="ml-auto" onClick={handleExport} disabled={!rows.length}>
            <Download className="mr-2 h-4 w-4" aria-hidden="true" /> Export CSV
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
        <Card className="flex items-center gap-4 p-6">
          <div className="rounded-lg bg-primary/10 p-3 text-primary">
            <Users className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total signups</p>
            <p className="text-2xl font-bold tabular-nums">{rows.length.toLocaleString()}</p>
          </div>
        </Card>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, country or use case"
            className="h-11 pl-9"
            aria-label="Search waitlist"
          />
        </div>

        <Card className="overflow-hidden">
          {loading ? (
            <p className="p-8 text-center text-muted-foreground">Loading entries…</p>
          ) : filtered.length === 0 ? (
            <p className="p-8 text-center text-muted-foreground">No entries found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Country</th>
                    <th className="p-3">Use case</th>
                    <th className="p-3">Joined</th>
                    <th className="p-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-t border-border"
                    >
                      <td className="p-3 tabular-nums text-muted-foreground">
                        {formatPosition(rows.findIndex((r) => r.id === row.id) + 1)}
                      </td>
                      <td className="p-3">{row.name || "—"}</td>
                      <td className="p-3">{row.email}</td>
                      <td className="p-3">{row.country || "—"}</td>
                      <td className="p-3">{row.use_case || "—"}</td>
                      <td className="p-3 text-muted-foreground">
                        {new Date(row.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete ${row.email}`}
                          onClick={() => handleDelete(row.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" aria-hidden="true" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default AdminWaitlist;
