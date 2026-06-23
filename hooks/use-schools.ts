"use client";

import * as React from "react";
import type { SelectOption } from "@/components/form/select-field";
import { createClient } from "@/lib/supabase/client";

interface SchoolRow {
  id: string;
  name: string;
}

export function useSchools() {
  const [schools, setSchools] = React.useState<SelectOption[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;

    (async () => {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("schools")
        .select("id, name")
        .eq("active", true)
        .order("name");

      if (!active) return;
      if (fetchError) {
        setError("Schools could not be loaded. Please try again.");
      } else {
        setSchools(
          ((data ?? []) as SchoolRow[]).map((school) => ({
            value: school.id,
            label: school.name,
          })),
        );
      }
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  return { schools, loading, error };
}
