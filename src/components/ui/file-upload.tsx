import { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  onChange?: (file: File | null) => void;
  onFileNameChange?: (fileName: string) => void;
  acceptedFileTypes?: string;
  maxFileSize?: number; // in MB
  showFileName?: boolean;
  currentFileName?: string;
  ref?: React.Ref<HTMLInputElement>;
}

function FileUpload({
  className,
  onChange,
  onFileNameChange,
  acceptedFileTypes = "*/*",
  maxFileSize = 100,
  showFileName = true,
  currentFileName,
  disabled,
  ref,
  ...props
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      onChange?.(null);
      onFileNameChange?.("");
      return;
    }

    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      alert(`File size must be less than ${maxFileSize}MB`);
      return;
    }

    setSelectedFile(file);
    onChange?.(file);
    onFileNameChange?.(file.name);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    if (disabled)
      return;

    const file = e.dataTransfer.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setDragActive(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const clearFile = () => {
    setSelectedFile(null);
    onChange?.(null);
    onFileNameChange?.("");

    // Clear the input value
    if (ref && "current" in ref && ref.current) {
      ref.current.value = "";
    }
  };

  const displayFileName = selectedFile?.name || currentFileName;

  return (
    <div className="space-y-2">
      {!displayFileName && (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-4 transition-colors",
            dragActive ? "border-main bg-primary/5" : "border-main/50",
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-main/100",
            className,
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Input
            ref={ref}
            type="file"
            accept={acceptedFileTypes}
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={disabled}
            {...props}
          />

          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="text-sm">
              <span className="font-medium text-primary">Click to upload</span>
              <span className="text-muted-foreground"> or drag and drop</span>
            </div>
            {maxFileSize && (
              <p className="text-xs text-muted-foreground">
                Max file size:
                {" "}
                {maxFileSize}
                MB
              </p>
            )}
          </div>
        </div>
      )}
      {showFileName && displayFileName && (
        <div className="flex items-center justify-between p-2 bg-third rounded-md">
          <span className="text-sm truncate flex-1" title={displayFileName}>
            {displayFileName}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFile}
            disabled={disabled}
            className="h-6 w-6 p-0 ml-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

FileUpload.displayName = "FileUpload";

export { FileUpload };
