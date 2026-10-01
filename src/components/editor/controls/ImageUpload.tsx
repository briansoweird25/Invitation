import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { IMAGE_ACCEPT, uploadInvitationImage, validateImageFile } from "@/lib/storage";
import { useAuthStore } from "@/stores/authStore";

interface ImageUploadProps {
  id: string;
  onUploaded: (url: string) => void;
}

export function ImageUpload({ id, onUploaded }: ImageUploadProps) {
  const userId = useAuthStore((s) => s.user?.id);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>();

  async function onFile(file: File | undefined) {
    if (!file || !userId) return;
    setError(undefined);
    const problem = await validateImageFile(file);
    if (problem) return setError(problem);

    setUploading(true);
    try {
      onUploaded(await uploadInvitationImage(userId, file));
      toast.success("Image uploaded");
    } catch (e) {
      setError(e instanceof Error ? e.message : undefined);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <Field id={id} label="Upload an image" helper="JPG, PNG or WebP, up to 5 MB." error={error}>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={IMAGE_ACCEPT}
        className="sr-only"
        tabIndex={-1}
        disabled={uploading}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => void onFile(e.target.files?.[0])}
      />
      <div>
        <Button type="button" variant="secondary" size="sm" disabled={uploading} onClick={() => inputRef.current?.click()}>
          {uploading ? "Uploading…" : "Choose image"}
        </Button>
      </div>
    </Field>
  );
}
