"use client";

import * as React from "react";
import { Add, Edit2, Trash, Box } from "iconsax-reactjs";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { DataTable, type Column } from "@/components/ui/data-table";
import { TableSkeleton } from "@/components/ui/skeletons";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/form/form-field";
import { SelectField } from "@/components/form/select-field";
import { FileUpload } from "@/components/form/file-upload";
import { PrimaryButton } from "@/components/ui/primary-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { FoodImage } from "@/components/student/food-image";
import { EmptyState } from "@/components/ui/empty-state";
import { formatNaira } from "@/helpers/vendor.helpers";
import { createClient } from "@/lib/supabase/client";
import { uploadOwnFile } from "@/lib/storage/upload";
import { toaster } from "@/components/ui/toaster";

interface Category {
  id: string;
  name: string;
}

interface MenuRow {
  id: string;
  name: string;
  price: number;
  description: string;
  categoryId: string;
  available: boolean;
  imageUrl: string | null;
}

const EMPTY_FORM = {
  name: "",
  price: "",
  description: "",
  categoryName: "",
};

const PLACEHOLDER_GRADIENT: [string, string] = ["#00452E", "#016644"];

/** Vendor menu management: add-food modal + menu table with row actions. */
export default function VendorMenu() {
  const [vendorId, setVendorId] = React.useState<string | null>(null);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [items, setItems] = React.useState<MenuRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [listError, setListError] = React.useState<string | null>(null);
  const [actingId, setActingId] = React.useState<string | null>(null);

  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<MenuRow | null>(null);
  const [form, setForm] = React.useState(EMPTY_FORM);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  const categoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.name ?? "Uncategorized";

  function toRow(data: {
    id: string;
    name: string | null;
    description: string | null;
    price: number | null;
    available: boolean | null;
    image_url: string | null;
    category_id: string | null;
  }): MenuRow {
    return {
      id: data.id,
      name: data.name ?? "",
      price: Number(data.price ?? 0),
      description: data.description ?? "",
      categoryId: data.category_id ?? "",
      available: data.available ?? true,
      imageUrl: data.image_url,
    };
  }

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const supabase = createClient();
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        const [{ data: vendor }, { data: cats }] = await Promise.all([
          supabase
            .from("vendors")
            .select("id")
            .eq("user_id", userData.user.id)
            .single(),
          supabase.from("food_categories").select("id, name").order("name"),
        ]);

        if (!active) return;
        setCategories(cats ?? []);

        if (!vendor) {
          setListError("No vendor profile found for this account.");
          return;
        }
        setVendorId(vendor.id);

        const { data: menu, error: menuError } = await supabase
          .from("menu_items")
          .select("id, name, description, price, available, image_url, category_id")
          .eq("vendor_id", vendor.id)
          .order("created_at", { ascending: false });

        if (!active) return;
        if (menuError) {
          setListError(menuError.message);
          return;
        }
        setItems((menu ?? []).map(toRow));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setExistingImageUrl(null);
    setSaveError(null);
    setOpen(true);
  }

  function openEdit(item: MenuRow) {
    setEditing(item);
    setForm({
      name: item.name,
      price: String(item.price),
      description: item.description,
      categoryName: categoryName(item.categoryId),
    });
    setImageFile(null);
    setExistingImageUrl(item.imageUrl);
    setSaveError(null);
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!vendorId) return;

    const category = categories.find((c) => c.name === form.categoryName);
    if (!category) {
      setSaveError("Select a category.");
      return;
    }

    setSaving(true);
    setSaveError(null);

    let imageUrl = existingImageUrl;
    if (imageFile) {
      const { data, error } = await uploadOwnFile("vendor-media", imageFile, "WIDE_PHOTO");
      if (error || !data) {
        const message = error ?? "Image upload failed.";
        setSaveError(message);
        toaster.create({ title: "Image upload failed", description: message, type: "error", duration: 4000, closable: true });
        setSaving(false);
        return;
      }
      imageUrl = data.publicUrl;
    }

    const supabase = createClient();
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price) || 0,
      category_id: category.id,
      image_url: imageUrl,
    };

    if (editing) {
      const { data, error } = await supabase
        .from("menu_items")
        .update(payload)
        .eq("id", editing.id)
        .select("id, name, description, price, available, image_url, category_id")
        .single();

      if (error || !data) {
        const message = error?.message ?? "Could not save changes.";
        setSaveError(message);
        toaster.create({ title: "Couldn't save item", description: message, type: "error", duration: 4000, closable: true });
        setSaving(false);
        return;
      }
      setItems((prev) => prev.map((i) => (i.id === data.id ? toRow(data) : i)));
      toaster.create({ title: "Item updated", description: `“${data.name}” has been saved.`, type: "success", duration: 3000, closable: true });
    } else {
      const { data, error } = await supabase
        .from("menu_items")
        .insert({ ...payload, vendor_id: vendorId })
        .select("id, name, description, price, available, image_url, category_id")
        .single();

      if (error || !data) {
        const message = error?.message ?? "Could not add item.";
        setSaveError(message);
        toaster.create({ title: "Couldn't add item", description: message, type: "error", duration: 4000, closable: true });
        setSaving(false);
        return;
      }
      setItems((prev) => [toRow(data), ...prev]);
      toaster.create({ title: "Item added", description: `“${data.name}” is now on your menu.`, type: "success", duration: 3000, closable: true });
    }

    setSaving(false);
    setOpen(false);
  }

  async function removeItem(id: string) {
    setActingId(id);
    const supabase = createClient();
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    setActingId(null);
    if (error) {
      setListError(error.message);
      toaster.create({ title: "Couldn't delete item", description: error.message, type: "error", duration: 4000, closable: true });
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
    toaster.create({ title: "Item deleted", type: "success", duration: 3000, closable: true });
  }

  async function toggleSoldOut(row: MenuRow) {
    setActingId(row.id);
    const supabase = createClient();
    const { error } = await supabase
      .from("menu_items")
      .update({ available: !row.available })
      .eq("id", row.id);
    setActingId(null);
    if (error) {
      setListError(error.message);
      toaster.create({ title: "Couldn't update availability", description: error.message, type: "error", duration: 4000, closable: true });
      return;
    }
    toaster.create({ title: row.available ? "Marked sold out" : "Marked available", type: "success", duration: 2500, closable: true });
    setItems((prev) =>
      prev.map((i) => (i.id === row.id ? { ...i, available: !i.available } : i)),
    );
  }

  const columns: Column<MenuRow>[] = [
    {
      key: "name",
      header: "Food name",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.imageUrl ? (
            <img
              src={row.imageUrl}
              alt={row.name}
              className="h-10 w-10 flex-shrink-0 rounded-xl object-cover"
            />
          ) : (
            <FoodImage
              emoji="🍽️"
              gradient={PLACEHOLDER_GRADIENT}
              size="sm"
              className="h-10 w-10 flex-shrink-0 rounded-xl"
            />
          )}
          <div className="min-w-0">
            <p className="truncate font-semibold text-[#111111]">{row.name}</p>
            <p className="text-xs text-[#666666]">{categoryName(row.categoryId)}</p>
          </div>
        </div>
      ),
    },
    { key: "price", header: "Price", render: (row) => formatNaira(row.price) },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <StatusBadge tone={row.available ? "success" : "danger"} dot>
          {row.available ? "Available" : "Sold out"}
        </StatusBadge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => toggleSoldOut(row)}
            disabled={actingId === row.id}
            title={row.available ? "Mark sold out" : "Mark available"}
            className="grid h-8 w-8 place-items-center rounded-lg text-[#666666] transition-colors hover:bg-[#00452E]/5 hover:text-[#00452E] disabled:opacity-50"
          >
            <Box size={16} variant="TwoTone" />
          </button>
          <button
            onClick={() => openEdit(row)}
            title="Edit"
            className="grid h-8 w-8 place-items-center rounded-lg text-[#666666] transition-colors hover:bg-[#00452E]/5 hover:text-[#00452E]"
          >
            <Edit2 size={16} variant="TwoTone" />
          </button>
          <button
            onClick={() => removeItem(row.id)}
            disabled={actingId === row.id}
            title="Delete"
            className="grid h-8 w-8 place-items-center rounded-lg text-[#666666] transition-colors hover:bg-[#FEE2E2] hover:text-[#DC2626] disabled:opacity-50"
          >
            <Trash size={16} variant="TwoTone" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <DashboardHeader
        title="Menu"
        subtitle={`${items.length} items on your menu.`}
        action={
          <PrimaryButton fullWidth={false} onClick={openAdd} disabled={loading}>
            <Add size={20} /> Add food
          </PrimaryButton>
        }
      />

      {listError && (
        <p className="mb-4 rounded-xl bg-[#FEE2E2] px-4 py-3 text-sm font-medium text-[#DC2626]">
          {listError}
        </p>
      )}

      {loading ? (
        <TableSkeleton rows={4} />
      ) : (
        <DataTable
          columns={columns}
          data={items}
          rowKey={(row) => row.id}
          empty={
            <EmptyState
              title="No menu items yet"
              description="Add your first dish to start receiving orders."
              action={
                <PrimaryButton fullWidth={false} onClick={openAdd}>
                  <Add size={20} /> Add food
                </PrimaryButton>
              }
            />
          }
        />
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit food" : "Add food"}
        description={
          editing
            ? "Update the details for this dish."
            : "Add a new dish to your menu."
        }
        footer={
          <div className="flex gap-3">
            <PrimaryButton variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </PrimaryButton>
            <PrimaryButton type="submit" form="food-form" loading={saving}>
              {editing ? "Save changes" : "Add to menu"}
            </PrimaryButton>
          </div>
        }
      >
        <form id="food-form" onSubmit={save} className="flex flex-col gap-4">
          {saveError && (
            <p className="rounded-xl bg-[#FEE2E2] px-4 py-3 text-sm font-medium text-[#DC2626]">
              {saveError}
            </p>
          )}

          <FormField
            label="Name"
            placeholder="Jollof Rice & Chicken"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Price (₦)"
              type="number"
              min={0}
              placeholder="2500"
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <SelectField
              label="Category"
              options={categories.map((c) => c.name)}
              placeholder="Select category"
              required
              value={form.categoryName}
              onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#111111]">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Short description of the dish"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full rounded-2xl border border-[#00452E]/15 bg-white px-4 py-3 text-[15px] text-[#111111] outline-none transition-all focus:border-[#00452E] focus:ring-4 focus:ring-[#00452E]/10"
            />
          </div>
          <FileUpload
            label="Image"
            variant="banner"
            hint="JPG or PNG"
            initialPreviewUrl={existingImageUrl}
            onFileChange={setImageFile}
          />
        </form>
      </Modal>
    </div>
  );
}
