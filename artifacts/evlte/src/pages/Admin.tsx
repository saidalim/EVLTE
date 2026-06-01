import React, { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { LiquidGlass } from "@/components/LiquidGlass";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListBrands, useCreateBrand, useUpdateBrand, useDeleteBrand,
  getListBrandsQueryKey,
  useListProducts, useCreateProduct, useUpdateProduct, useDeleteProduct,
  getListProductsQueryKey,
  useListBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost,
  getListBlogPostsQueryKey,
  useGetSiteSettings, useUpdateSiteSettings,
  getGetSiteSettingsQueryKey,
} from "@workspace/api-client-react";

type Tab = "brands" | "products" | "blog" | "settings";

function BrandsTab() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const { data: brands } = useListBrands({ query: { queryKey: getListBrandsQueryKey() } });
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const deleteBrand = useDeleteBrand();
  const [form, setForm] = useState({ nameEn: "", nameRu: "", nameUz: "", slug: "", logoUrl: "", description: "", order: 0 });
  const [editId, setEditId] = useState<number | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: getListBrandsQueryKey() });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, order: Number(form.order) };
    if (editId) {
      updateBrand.mutate({ id: editId, data }, { onSuccess: () => { invalidate(); setEditId(null); setForm({ nameEn: "", nameRu: "", nameUz: "", slug: "", logoUrl: "", description: "", order: 0 }); } });
    } else {
      createBrand.mutate({ data }, { onSuccess: () => { invalidate(); setForm({ nameEn: "", nameRu: "", nameUz: "", slug: "", logoUrl: "", description: "", order: 0 }); } });
    }
  };

  const startEdit = (b: any) => {
    setEditId(b.id);
    setForm({ nameEn: b.nameEn, nameRu: b.nameRu, nameUz: b.nameUz, slug: b.slug, logoUrl: b.logoUrl ?? "", description: b.description ?? "", order: b.order });
  };

  return (
    <div className="space-y-8">
      <LiquidGlass className="rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-5">{editId ? t({ en: "Edit Brand", ru: "Редактировать бренд", uz: "Brendni tahrirlash" }) : t({ en: "Add Brand", ru: "Добавить бренд", uz: "Brend qo'shish" })}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: "nameEn", label: "Name (EN)" }, { key: "nameRu", label: "Name (RU)" }, { key: "nameUz", label: "Name (UZ)" },
            { key: "slug", label: "Slug" }, { key: "logoUrl", label: "Logo URL" }, { key: "description", label: "Description" },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">{f.label}</label>
              <input
                value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder={f.label}
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium mb-1 text-muted-foreground">Order</label>
            <input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="px-6 py-2 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors">
              {editId ? t({ en: "Save", ru: "Сохранить", uz: "Saqlash" }) : t({ en: "Add", ru: "Добавить", uz: "Qo'shish" })}
            </button>
            {editId && <button type="button" onClick={() => { setEditId(null); setForm({ nameEn: "", nameRu: "", nameUz: "", slug: "", logoUrl: "", description: "", order: 0 }); }}
              className="px-6 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-secondary/50 transition-colors">
              {t({ en: "Cancel", ru: "Отмена", uz: "Bekor" })}
            </button>}
          </div>
        </form>
      </LiquidGlass>

      <LiquidGlass className="rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/30 border-b border-border/40">
            <tr>
              <th className="text-left px-5 py-3 font-semibold">Name (EN)</th>
              <th className="text-left px-5 py-3 font-semibold">Slug</th>
              <th className="text-left px-5 py-3 font-semibold">Order</th>
              <th className="px-5 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {brands?.map(b => (
              <tr key={b.id} className="hover:bg-secondary/20 transition-colors">
                <td className="px-5 py-3 font-medium">{b.nameEn}</td>
                <td className="px-5 py-3 text-muted-foreground">{b.slug}</td>
                <td className="px-5 py-3 text-muted-foreground">{b.order}</td>
                <td className="px-5 py-3 text-center">
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => startEdit(b)} className="text-xs px-3 py-1 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors">Edit</button>
                    <button onClick={() => { if (confirm("Delete?")) deleteBrand.mutate({ id: b.id }, { onSuccess: invalidate }); }}
                      className="text-xs px-3 py-1 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </LiquidGlass>
    </div>
  );
}

function ProductsTab() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const { data: products } = useListProducts({ query: { queryKey: getListProductsQueryKey() } });
  const { data: brands } = useListBrands({ query: { queryKey: getListBrandsQueryKey() } });
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const [editId, setEditId] = useState<number | null>(null);
  const emptyForm = { nameEn: "", nameRu: "", nameUz: "", descriptionEn: "", descriptionRu: "", descriptionUz: "", type: "charger", powerKw: "", price: 0, imageUrl: "", brandId: 0, categoryId: 0, featured: false, inStock: true };
  const [form, setForm] = useState<any>(emptyForm);

  const invalidate = () => qc.invalidateQueries({ queryKey: getListProductsQueryKey() });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, price: Number(form.price), brandId: form.brandId ? Number(form.brandId) : undefined, categoryId: form.categoryId ? Number(form.categoryId) : undefined, powerKw: form.powerKw || undefined };
    if (editId) {
      updateProduct.mutate({ id: editId, data }, { onSuccess: () => { invalidate(); setEditId(null); setForm(emptyForm); } });
    } else {
      createProduct.mutate({ data }, { onSuccess: () => { invalidate(); setForm(emptyForm); } });
    }
  };

  const startEdit = (p: any) => {
    setEditId(p.id);
    setForm({ ...p, price: Number(p.price), brandId: p.brandId ?? 0, categoryId: p.categoryId ?? 0, powerKw: p.powerKw ?? "" });
  };

  return (
    <div className="space-y-8">
      <LiquidGlass className="rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-5">{editId ? "Edit Product" : "Add Product"}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: "nameEn", label: "Name (EN)" }, { key: "nameRu", label: "Name (RU)" }, { key: "nameUz", label: "Name (UZ)" },
            { key: "descriptionEn", label: "Description (EN)" }, { key: "descriptionRu", label: "Description (RU)" }, { key: "descriptionUz", label: "Description (UZ)" },
            { key: "imageUrl", label: "Image URL" },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">{f.label}</label>
              <input value={form[f.key] ?? ""} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium mb-1 text-muted-foreground">Type</label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="charger">Charger</option>
              <option value="accessory">Accessory</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-muted-foreground">Power (kW)</label>
            <select value={form.powerKw} onChange={e => setForm({ ...form, powerKw: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">None</option>
              <option value="1.5">1.5 kW</option>
              <option value="3.5">3.5 kW</option>
              <option value="7">7 kW</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-muted-foreground">Price ($)</label>
            <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-muted-foreground">Brand</label>
            <select value={form.brandId} onChange={e => setForm({ ...form, brandId: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value={0}>-- No Brand --</option>
              {brands?.map(b => <option key={b.id} value={b.id}>{b.nameEn}</option>)}
            </select>
          </div>
          <div className="flex gap-6 items-center pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded" />
              <span className="text-sm font-medium">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.inStock} onChange={e => setForm({ ...form, inStock: e.target.checked })} className="w-4 h-4 rounded" />
              <span className="text-sm font-medium">In Stock</span>
            </label>
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="px-6 py-2 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors">
              {editId ? "Save" : "Add Product"}
            </button>
            {editId && <button type="button" onClick={() => { setEditId(null); setForm(emptyForm); }}
              className="px-6 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-secondary/50 transition-colors">Cancel</button>}
          </div>
        </form>
      </LiquidGlass>

      <LiquidGlass className="rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/30 border-b border-border/40">
            <tr>
              <th className="text-left px-5 py-3 font-semibold">Name</th>
              <th className="text-left px-5 py-3 font-semibold">Type</th>
              <th className="text-left px-5 py-3 font-semibold">Power</th>
              <th className="text-left px-5 py-3 font-semibold">Price</th>
              <th className="px-5 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {products?.map(p => (
              <tr key={p.id} className="hover:bg-secondary/20 transition-colors">
                <td className="px-5 py-3 font-medium">{p.nameEn}</td>
                <td className="px-5 py-3 text-muted-foreground capitalize">{p.type}</td>
                <td className="px-5 py-3 text-muted-foreground">{p.powerKw ? `${p.powerKw} kW` : "—"}</td>
                <td className="px-5 py-3 text-primary font-semibold">${Number(p.price)}</td>
                <td className="px-5 py-3 text-center">
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => startEdit(p)} className="text-xs px-3 py-1 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors">Edit</button>
                    <button onClick={() => { if (confirm("Delete?")) deleteProduct.mutate({ id: p.id }, { onSuccess: invalidate }); }}
                      className="text-xs px-3 py-1 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </LiquidGlass>
    </div>
  );
}

function BlogTab() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const { data: posts } = useListBlogPosts({ query: { queryKey: getListBlogPostsQueryKey() } });
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const deletePost = useDeleteBlogPost();
  const emptyForm = { titleEn: "", titleRu: "", titleUz: "", contentEn: "", contentRu: "", contentUz: "", summaryEn: "", summaryRu: "", summaryUz: "", imageUrl: "" };
  const [form, setForm] = useState<any>(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: getListBlogPostsQueryKey() });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      updatePost.mutate({ id: editId, data: form }, { onSuccess: () => { invalidate(); setEditId(null); setForm(emptyForm); } });
    } else {
      createPost.mutate({ data: form }, { onSuccess: () => { invalidate(); setForm(emptyForm); } });
    }
  };

  const startEdit = (p: any) => {
    setEditId(p.id);
    setForm({ titleEn: p.titleEn, titleRu: p.titleRu, titleUz: p.titleUz, contentEn: p.contentEn, contentRu: p.contentRu, contentUz: p.contentUz, summaryEn: p.summaryEn ?? "", summaryRu: p.summaryRu ?? "", summaryUz: p.summaryUz ?? "", imageUrl: p.imageUrl ?? "" });
  };

  return (
    <div className="space-y-8">
      <LiquidGlass className="rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-5">{editId ? "Edit Post" : "Add Blog Post"}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: "titleEn", label: "Title (EN)" }, { key: "titleRu", label: "Title (RU)" }, { key: "titleUz", label: "Title (UZ)" },
            { key: "summaryEn", label: "Summary (EN)" }, { key: "summaryRu", label: "Summary (RU)" }, { key: "summaryUz", label: "Summary (UZ)" },
            { key: "imageUrl", label: "Image URL" },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">{f.label}</label>
              <input value={form[f.key] ?? ""} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          ))}
          {[
            { key: "contentEn", label: "Content (EN)" }, { key: "contentRu", label: "Content (RU)" }, { key: "contentUz", label: "Content (UZ)" },
          ].map(f => (
            <div key={f.key} className="md:col-span-2">
              <label className="block text-xs font-medium mb-1 text-muted-foreground">{f.label}</label>
              <textarea rows={4} value={form[f.key] ?? ""} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
          ))}
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="px-6 py-2 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors">
              {editId ? "Save" : "Add Post"}
            </button>
            {editId && <button type="button" onClick={() => { setEditId(null); setForm(emptyForm); }}
              className="px-6 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-secondary/50 transition-colors">Cancel</button>}
          </div>
        </form>
      </LiquidGlass>

      <LiquidGlass className="rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/30 border-b border-border/40">
            <tr>
              <th className="text-left px-5 py-3 font-semibold">Title (EN)</th>
              <th className="px-5 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {posts?.map(p => (
              <tr key={p.id} className="hover:bg-secondary/20 transition-colors">
                <td className="px-5 py-3 font-medium">{p.titleEn}</td>
                <td className="px-5 py-3 text-center">
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => startEdit(p)} className="text-xs px-3 py-1 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors">Edit</button>
                    <button onClick={() => { if (confirm("Delete?")) deletePost.mutate({ id: p.id }, { onSuccess: invalidate }); }}
                      className="text-xs px-3 py-1 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </LiquidGlass>
    </div>
  );
}

function SettingsTab() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const { data: settings } = useGetSiteSettings({ query: { queryKey: getGetSiteSettingsQueryKey() } });
  const updateSettings = useUpdateSiteSettings();
  const [form, setForm] = useState<any>({});
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    if (settings) setForm({ ...settings });
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { id, ...data } = form;
    updateSettings.mutate({ data }, { onSuccess: () => { qc.invalidateQueries({ queryKey: getGetSiteSettingsQueryKey() }); setSaved(true); setTimeout(() => setSaved(false), 2000); } });
  };

  const fields = [
    { key: "phone", label: "Phone" }, { key: "email", label: "Email" },
    { key: "instagramUrl", label: "Instagram URL" }, { key: "facebookUrl", label: "Facebook URL" },
    { key: "telegramUrl", label: "Telegram URL" }, { key: "youtubeUrl", label: "YouTube URL" },
    { key: "addressEn", label: "Address (EN)" }, { key: "addressRu", label: "Address (RU)" }, { key: "addressUz", label: "Address (UZ)" },
  ];

  return (
    <LiquidGlass className="rounded-2xl p-6 max-w-2xl">
      <h3 className="text-lg font-bold mb-5">Site Settings</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(f => (
          <div key={f.key}>
            <label className="block text-xs font-medium mb-1 text-muted-foreground">{f.label}</label>
            <input
              value={form[f.key] ?? ""}
              onChange={e => setForm({ ...form, [f.key]: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder={f.label}
            />
          </div>
        ))}
        <div className="flex items-center gap-4 pt-2">
          <button type="submit" className="px-6 py-2 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors">
            {updateSettings.isPending ? "Saving..." : "Save Settings"}
          </button>
          {saved && <span className="text-green-600 text-sm font-medium">Saved!</span>}
        </div>
      </form>
    </LiquidGlass>
  );
}

export function Admin() {
  const [tab, setTab] = useState<Tab>("brands");
  const { t } = useI18n();

  const tabs: { id: Tab; label: { en: string; ru: string; uz: string } }[] = [
    { id: "brands", label: { en: "Brands", ru: "Бренды", uz: "Brendlar" } },
    { id: "products", label: { en: "Products", ru: "Товары", uz: "Mahsulotlar" } },
    { id: "blog", label: { en: "Blog Posts", ru: "Статьи", uz: "Maqolalar" } },
    { id: "settings", label: { en: "Site Settings", ru: "Настройки", uz: "Sozlamalar" } },
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">{t({ en: "Manage EVLTE website content", ru: "Управляйте контентом сайта EVLTE", uz: "EVLTE veb-sayt kontentini boshqarish" })}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border/40 pb-0">
          {tabs.map(tab_ => (
            <button
              key={tab_.id}
              onClick={() => setTab(tab_.id)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all -mb-px ${tab === tab_.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {t(tab_.label)}
            </button>
          ))}
        </div>

        {tab === "brands" && <BrandsTab />}
        {tab === "products" && <ProductsTab />}
        {tab === "blog" && <BlogTab />}
        {tab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}
