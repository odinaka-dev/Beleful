"use client";

import * as React from "react";
import { Add, Edit2, Trash, Box } from "iconsax-reactjs";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/form/form-field";
import { SelectField } from "@/components/form/select-field";
import { FileUpload } from "@/components/form/file-upload";
import { PrimaryButton } from "@/components/ui/primary-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { FoodImage } from "@/components/student/food-image";
import { EmptyState } from "@/components/ui/empty-state";
import {
  MENU_ITEMS,
  formatNaira,
  type MenuItem,
} from "@/helpers/vendor.helpers";
import { FOOD_CATEGORIES } from "@/helpers/auth.helpers";

const EMPTY_FORM = {
  name: "",
  price: "",
  description: "",
  category: "",
};

/** Vendor menu management: add-food modal + menu table with row actions. */
export default function VendorMenu() {
  const [items, setItems] = React.useState<MenuItem[]>(MENU_ITEMS);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<MenuItem | null>(null);
  const [form, setForm] = React.useState(EMPTY_FORM);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(item: MenuItem) {
    setEditing(item);
    setForm({
      name: item.name,
      price: String(item.price),
      description: item.description,
      category: item.category,
    });
    setOpen(true);
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === editing.id
            ? {
                ...i,
                name: form.name,
                price: Number(form.price) || 0,
                description: form.description,
                category: form.category,
              }
            : i,
        ),
      );
    } else {
      setItems((prev) => [
        {
          id: `item-${prev.length + 1}-${form.name.toLowerCase().replace(/\s+/g, "-")}`,
          name: form.name,
          price: Number(form.price) || 0,
          description: form.description,
          category: form.category || "Other",
          status: "available",
          emoji: "🍽️",
          gradient: ["#00452E", "#016644"],
        },
        ...prev,
      ]);
    }
    setOpen(false);
  }

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const toggleSoldOut = (id: string) =>
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: i.status === "available" ? "sold_out" : "available" }
          : i,
      ),
    );

  const columns: Column<MenuItem>[] = [
    {
      key: "name",
      header: "Food name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <FoodImage
            emoji={row.emoji}
            gradient={row.gradient}
            size="sm"
            className="h-10 w-10 flex-shrink-0 rounded-xl"
          />
          <div className="min-w-0">
            <p className="truncate font-semibold text-[#111111]">{row.name}</p>
            <p className="text-xs text-[#666666]">{row.category}</p>
          </div>
        </div>
      ),
    },
    { key: "price", header: "Price", render: (row) => formatNaira(row.price) },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <StatusBadge tone={row.status === "available" ? "success" : "danger"} dot>
          {row.status === "available" ? "Available" : "Sold out"}
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
            onClick={() => toggleSoldOut(row.id)}
            title={row.status === "available" ? "Mark sold out" : "Mark available"}
            className="grid h-8 w-8 place-items-center rounded-lg text-[#666666] transition-colors hover:bg-[#00452E]/5 hover:text-[#00452E]"
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
            title="Delete"
            className="grid h-8 w-8 place-items-center rounded-lg text-[#666666] transition-colors hover:bg-[#FEE2E2] hover:text-[#DC2626]"
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
          <PrimaryButton fullWidth={false} onClick={openAdd}>
            <Add size={20} /> Add food
          </PrimaryButton>
        }
      />

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
            <PrimaryButton type="submit" form="food-form">
              {editing ? "Save changes" : "Add to menu"}
            </PrimaryButton>
          </div>
        }
      >
        <form id="food-form" onSubmit={save} className="flex flex-col gap-4">
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
              options={FOOD_CATEGORIES}
              placeholder="Select category"
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
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
          <FileUpload label="Image" variant="banner" hint="JPG or PNG" />
        </form>
      </Modal>
    </div>
  );
}
