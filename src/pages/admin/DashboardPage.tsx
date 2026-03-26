import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Building2, MapPin, Tag, Calendar } from "lucide-react";

const StatCard = ({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) => (
  <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4">
    <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${color}`}>
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const [stats, setStats] = useState({ establishments: 0, cities: 0, categories: 0, events: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [est, cit, cat, evt] = await Promise.all([
        supabase.from("establishments").select("id", { count: "exact", head: true }),
        supabase.from("cities").select("id", { count: "exact", head: true }),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        establishments: est.count || 0,
        cities: cit.count || 0,
        categories: cat.count || 0,
        events: evt.count || 0,
      });
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-sans font-normal text-foreground mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Estabelecimentos" value={stats.establishments} icon={Building2} color="bg-primary/10 text-primary" />
        <StatCard label="Cidades" value={stats.cities} icon={MapPin} color="bg-secondary/10 text-secondary" />
        <StatCard label="Categorias" value={stats.categories} icon={Tag} color="bg-accent text-accent-foreground" />
        <StatCard label="Eventos" value={stats.events} icon={Calendar} color="bg-destructive/10 text-destructive" />
      </div>
    </div>
  );
};

export default DashboardPage;
