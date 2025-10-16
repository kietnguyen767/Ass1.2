"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 1000,   // mặc định >=1000
    imageUrl: "",
  });

  useEffect(() => {
    if (!id) return;
    // fetch product data để điền form
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) =>
        setForm({
          name: data.name,
          description: data.description,
          price: data.price,
          imageUrl: data.imageUrl || "",
        })
      );
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.price < 1000) {
      setMessage("❌ Giá sản phẩm phải lớn hơn hoặc bằng 1000₫");
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price.toString());

    const fileInput = document.getElementById("file") as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      formData.append("file", fileInput.files[0]);
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        setMessage("✅ Updated successfully");
        setTimeout(() => router.push(`/products/${id}`), 1000);
      } else {
        const error = await res.json();
        setMessage(`❌ Update failed: ${error.error || "Unknown error"}`);
      }
    } catch (err) {
      setMessage("❌ Update failed: Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto p-6">
      {/* Header với tên cửa hàng + nút Back */}
      <header className="mb-4">
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 hover:underline"
        >
          ClothingStore
        </Link>
        <div className="mt-2">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            ← Back
          </button>
        </div>
      </header>

      <h1 className="text-xl font-bold mb-4">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1">Price</label>
          <input
            type="number"
            value={form.price}
            min={1000}   // giá tối thiểu 1000₫
            onChange={(e) =>
              setForm({ ...form, price: parseFloat(e.target.value) })
            }
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Ảnh sản phẩm</label>
          <input
            type="file"
            id="file"
            name="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              setSelectedFileName(e.target.files?.[0]?.name || null)
            }
          />
          <label
            htmlFor="file"
            className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded cursor-pointer hover:bg-blue-700"
          >
            📂 Chọn ảnh mới
          </label>

          {selectedFileName && (
            <p className="mt-1 text-gray-700 text-sm">
              Đã chọn: {selectedFileName}
            </p>
          )}

          {!selectedFileName && form.imageUrl && (
            <p className="mt-1 text-gray-700 text-sm">
              Ảnh hiện tại: {form.imageUrl}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update"}
        </button>

        {message && <p className="mt-2 text-red-600">{message}</p>}
      </form>
    </main>
  );
}
