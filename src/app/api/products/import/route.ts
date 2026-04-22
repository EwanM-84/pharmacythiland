import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

interface ImportProduct {
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
}

export async function POST(req: NextRequest) {
  try {
    // Verify admin
    const supabaseServer = await createServerClient();
    const { data: { user } } = await supabaseServer.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const adminClient = createAdminClient();
    const { data: profile } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if ((profile as { role: string } | null)?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { products } = await req.json() as { products: ImportProduct[] };
    if (!products?.length) return NextResponse.json({ error: "No products" }, { status: 400 });

    // Resolve category names to IDs
    const categoryNames = [...new Set(products.map((p) => p.category).filter(Boolean))] as string[];
    let categoryMap: Record<string, string> = {};
    if (categoryNames.length > 0) {
      const { data: cats } = await adminClient
        .from("categories")
        .select("id,name")
        .in("name", categoryNames);
      if (cats) {
        for (const cat of cats as { id: string; name: string }[]) {
          categoryMap[cat.name] = cat.id;
        }
      }
    }

    let created = 0;
    let updated = 0;

    for (const product of products) {
      const slug = slugify(product.name);
      const categoryId = product.category ? categoryMap[product.category] ?? null : null;

      const payload = {
        name: product.name,
        slug,
        sku: product.sku,
        barcode: product.barcode,
        description: product.description,
        short_description: product.short_description,
        price: product.price,
        cost_price: product.cost_price,
        compare_price: product.compare_price,
        stock_qty: product.stock_qty,
        category_id: categoryId,
        requires_prescription: product.requires_prescription,
        tags: product.tags,
        is_active: true,
        updated_at: new Date().toISOString(),
      };

      // Check if SKU exists
      if (product.sku) {
        const { data: existing } = await adminClient
          .from("products")
          .select("id")
          .eq("sku", product.sku)
          .single();

        if (existing) {
          await adminClient
            .from("products")
            .update(payload as any)
            .eq("id", (existing as { id: string }).id);
          updated++;
          continue;
        }
      }

      await adminClient.from("products").insert([{ ...payload, images: [], low_stock_threshold: 10 } as any]);
      created++;
    }

    return NextResponse.json({ success: true, created, updated });
  } catch (err) {
    console.error("Import error:", err);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
