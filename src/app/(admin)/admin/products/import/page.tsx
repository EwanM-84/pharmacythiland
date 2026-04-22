"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { toast } from "sonner";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CsvRow {
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  short_description?: string;
  price: string;
  cost_price?: string;
  compare_price?: string;
  stock_qty: string;
  category?: string;
  requires_prescription?: string;
  tags?: string;
}

interface ParsedProduct {
  name: string;
  sku: string | null;
  barcode: string | null;
  description: string | null;
  short_description: string | null;
  price: number;
  cost_price: number | null;
  compare_price: number | null;
  stock_qty: number;
  category: string | null;
  requires_prescription: boolean;
  tags: string[];
  _error?: string;
}

const EXPECTED_COLUMNS = ["name", "price", "stock_qty"];

export default function ImportProductsPage() {
  const router = useRouter();
  const [parsed, setParsed] = useState<ParsedProduct[] | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const rows = result.data;
        const errs: string[] = [];

        // Check required columns
        const cols = Object.keys(rows[0] ?? {});
        for (const col of EXPECTED_COLUMNS) {
          if (!cols.includes(col)) errs.push(`Missing required column: ${col}`);
        }
        if (errs.length) { setErrors(errs); setParsed(null); return; }

        const products: ParsedProduct[] = rows.map((row, i) => {
          const rowErrors: string[] = [];
          if (!row.name) rowErrors.push(`Row ${i + 2}: name is required`);
          const price = parseFloat(row.price);
          if (isNaN(price) || price < 0) rowErrors.push(`Row ${i + 2}: invalid price`);
          const stock = parseInt(row.stock_qty, 10);
          if (isNaN(stock)) rowErrors.push(`Row ${i + 2}: invalid stock_qty`);

          return {
            name: row.name,
            sku: row.sku || null,
            barcode: row.barcode || null,
            description: row.description || null,
            short_description: row.short_description || null,
            price: isNaN(price) ? 0 : price,
            cost_price: row.cost_price ? parseFloat(row.cost_price) : null,
            compare_price: row.compare_price ? parseFloat(row.compare_price) : null,
            stock_qty: isNaN(stock) ? 0 : stock,
            category: row.category || null,
            requires_prescription: row.requires_prescription?.toLowerCase() === "true",
            tags: row.tags ? row.tags.split(",").map((t) => t.trim()) : [],
            _error: rowErrors.length > 0 ? rowErrors.join("; ") : undefined,
          };
        });

        const allErrors = products.filter((p) => p._error).map((p) => p._error!);
        setErrors(allErrors);
        setParsed(products);
      },
      error: (err) => {
        setErrors([err.message]);
      },
    });
  }

  async function handleImport() {
    if (!parsed) return;
    const valid = parsed.filter((p) => !p._error);
    if (valid.length === 0) { toast.error("No valid rows to import"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: valid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Import failed");
      toast.success(`Imported ${data.created} new, updated ${data.updated} products`);
      router.push("/admin/products");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Import failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Import Products</h1>
        <p className="text-[var(--color-text-secondary)] text-sm mt-1">
          Upload a CSV file to bulk import or update products. Products are matched by SKU.
        </p>
      </div>

      {/* Template download */}
      <div className="card p-4 mb-6 flex items-center justify-between">
        <div>
          <p className="font-semibold text-sm">CSV Template</p>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Required: name, price, stock_qty · Optional: sku, barcode, description, cost_price, compare_price, category, requires_prescription, tags
          </p>
        </div>
        <a
          href="data:text/csv;charset=utf-8,name,sku,barcode,description,short_description,price,cost_price,compare_price,stock_qty,category,requires_prescription,tags%0AParacetamol 500mg,PARA-500,,Pain relief tablets,Fast-acting pain relief,120,,150,100,Pain Relief,false,pain,tablets"
          download="product-template.csv"
          className="btn-secondary text-sm py-2 px-4"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
        >
          Download Template
        </a>
      </div>

      {/* Upload area */}
      <div className="card p-8 mb-6 flex flex-col items-center gap-4 border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary-400)] transition-colors">
        <Upload className="w-10 h-10 text-[var(--color-primary-400)]" />
        <div className="text-center">
          <p className="font-semibold">Drop CSV file here or click to browse</p>
          <p className="text-sm text-[var(--color-text-secondary)]">CSV files only, max 5MB</p>
        </div>
        <input type="file" accept=".csv" onChange={handleFile} className="w-full max-w-xs text-sm" />
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="card p-4 mb-6 border-[var(--color-error)] border">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-error" />
            <p className="font-semibold text-sm text-error">Validation Errors</p>
          </div>
          <ul className="text-sm text-error flex flex-col gap-1">
            {errors.slice(0, 10).map((e, i) => <li key={i}>• {e}</li>)}
            {errors.length > 10 && <li>… and {errors.length - 10} more</li>}
          </ul>
        </div>
      )}

      {/* Preview */}
      {parsed && (
        <div className="card overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <p className="font-semibold text-sm">
                {parsed.filter((p) => !p._error).length} valid rows
                {errors.length > 0 && ` (${errors.length} with errors — skipped)`}
              </p>
            </div>
          </div>
          <div className="overflow-x-auto max-h-72">
            <table className="w-full text-xs">
              <thead className="bg-[var(--color-surface-secondary)]">
                <tr>
                  {["Name", "SKU", "Price", "Cost", "Stock", "Category", "Rx"].map((h) => (
                    <th key={h} className="px-3 py-2 text-left font-semibold text-[var(--color-text-secondary)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {parsed.slice(0, 20).map((row, i) => (
                  <tr key={i} className={row._error ? "bg-[var(--color-error-bg)]" : ""}>
                    <td className="px-3 py-2">{row.name}</td>
                    <td className="px-3 py-2 text-[var(--color-text-secondary)]">{row.sku ?? "—"}</td>
                    <td className="px-3 py-2">฿{row.price}</td>
                    <td className="px-3 py-2 text-[var(--color-text-secondary)]">{row.cost_price ? `฿${row.cost_price}` : "—"}</td>
                    <td className="px-3 py-2">{row.stock_qty}</td>
                    <td className="px-3 py-2 text-[var(--color-text-secondary)]">{row.category ?? "—"}</td>
                    <td className="px-3 py-2">{row.requires_prescription ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {parsed.length > 20 && <p className="p-3 text-xs text-[var(--color-text-secondary)]">… and {parsed.length - 20} more rows</p>}
          </div>
        </div>
      )}

      {parsed && parsed.filter((p) => !p._error).length > 0 && (
        <Button onClick={handleImport} loading={loading} size="lg">
          Import {parsed.filter((p) => !p._error).length} Products
        </Button>
      )}
    </div>
  );
}
