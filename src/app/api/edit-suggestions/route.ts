import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  buildProposedArticleRow,
  computeChangedFields,
} from "@/lib/edit-suggestions";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      slug,
      articleTitle,
      suggestedBy,
      suggestedByEmail,
      description,
      newContent,
      originalContent,
      proposedData,
    } = body;

    const normalizedSlug = typeof slug === "string" ? decodeURIComponent(slug) : "";

    if (!normalizedSlug || !suggestedBy || !suggestedByEmail || !description) {
      return NextResponse.json(
        { error: "جميع الحقول المطلوبة يجب تعبئتها" },
        { status: 400 },
      );
    }

    const { data: currentArticle, error: articleError } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", normalizedSlug)
      .maybeSingle();

    if (articleError || !currentArticle) {
      return NextResponse.json(
        { error: "تعذّر العثور على المقال المراد اقتراح تعديله" },
        { status: 404 },
      );
    }

    let proposedChanges: Record<string, unknown> | null = null;
    let originalSnapshot: Record<string, unknown> | null = null;
    let compatibleNewContent: string | null = null;
    let compatibleOriginalContent: string | null = null;

    if (proposedData && typeof proposedData === "object") {
      const proposedRow = buildProposedArticleRow(
        proposedData as Record<string, unknown>,
        currentArticle.article_type,
      );
      const computed = computeChangedFields(currentArticle, proposedRow);
      const hasChanges = Object.keys(computed.proposedChanges).length > 0;

      if (!hasChanges) {
        return NextResponse.json(
          { error: "لم يتم رصد أي تغييرات فعلية لحفظها كاقتراح تعديل" },
          { status: 400 },
        );
      }

      proposedChanges = computed.proposedChanges;
      originalSnapshot = computed.originalSnapshot;

      if ("content" in computed.proposedChanges) {
        compatibleNewContent =
          (computed.proposedChanges.content as string | null) ?? null;
        compatibleOriginalContent =
          (computed.originalSnapshot.content as string | null) ?? null;
      }
    } else {
      const normalizedNewContent =
        typeof newContent === "string" && newContent.trim().length > 0
          ? newContent
          : null;
      const currentContent =
        typeof currentArticle.content === "string" ? currentArticle.content : null;

      if (!normalizedNewContent || normalizedNewContent === currentContent) {
        return NextResponse.json(
          { error: "يرجى تقديم تغييرات فعلية قبل إرسال الاقتراح" },
          { status: 400 },
        );
      }

      compatibleNewContent = normalizedNewContent;
      compatibleOriginalContent =
        typeof originalContent === "string" ? originalContent : currentContent;
    }

    const { error } = await supabase.from("edit_suggestions").insert({
      article_slug: normalizedSlug,
      article_title: articleTitle,
      suggested_by: suggestedBy,
      suggested_by_email: suggestedByEmail,
      description,
      new_content: compatibleNewContent,
      original_content: compatibleOriginalContent,
      proposed_changes: proposedChanges,
      original_snapshot: originalSnapshot,
      status: "pending",
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "فشل في حفظ الاقتراح" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating edit suggestion:", error);
    return NextResponse.json({ error: "فشل في إرسال الاقتراح" }, { status: 500 });
  }
}
