"use client";

import { useState } from "react";
import { Pencil, X } from "lucide-react";

import ArticleForm from "./ArticleForm";
import type { WikiArticle } from "@/lib/wiki";

interface SuggestEditButtonProps {
  article: WikiArticle;
}

export default function SuggestEditButton({ article }: SuggestEditButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 px-3 py-1.5 text-sm text-text-secondary hover:text-primary hover:bg-primary/5 rounded transition-colors"
        title="اقتراح تعديل"
      >
        <Pencil size={14} />
        <span>اقتراح تعديل</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 p-4">
          <div className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white">
            <div className="flex items-start justify-between gap-3 border-b border-border-light p-4">
              <h2 className="text-lg font-heading font-bold text-primary sm:text-xl">
                اقتراح تعديل على: {article.title}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded p-1.5 hover:bg-gray-100"
                aria-label="إغلاق"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <ArticleForm
                mode="suggest_edit"
                initialTitle={article.title}
                initialData={article}
                suggestionSlug={article.slug}
                suggestionArticleTitle={article.title}
                lockArticleType
                onCancel={() => setIsOpen(false)}
                onSubmitted={() => setIsOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
