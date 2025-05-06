/* eslint-disable jsx-a11y/img-redundant-alt */
"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IconMinimize, IconPhoto, IconTrash, IconUpload, IconX, IconZoomIn, IconZoomOut } from "@tabler/icons-react"

interface ImageFile {
    id: string
    file: File
    preview: string
    isNew?: boolean // Flag to identify new uploads
}

export interface ImageData {
    deletedImages: string[]
    newImages: File[]
}

interface ImageUploaderProps {
    onChange?: (files: File | File[] | null) => void
    value?: string | string[]
    className?: string
    label?: string
    maxImages?: number
    defaultMode?: "single" | "multiple"
    showModeToggle?: boolean
    onImagesChange?: (data: ImageData) => void
}

export default function ImageUploader({
    onChange,
    value,
    className,
    label = "Images",
    maxImages = 10,
    defaultMode = "single",
    showModeToggle = true,
    onImagesChange,
}: ImageUploaderProps) {
    const [mode, setMode] = useState<"single" | "multiple">(defaultMode)
    const [singleImage, setSingleImage] = useState<ImageFile | null>(null)
    const [multiImages, setMultiImages] = useState<ImageFile[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [lightbox, setLightbox] = useState<{
        isOpen: boolean
        imageIndex: number
    }>({
        isOpen: false,
        imageIndex: 0,
    })
    const [zoomLevel, setZoomLevel] = useState(1)
    const singleInputRef = useRef<HTMLInputElement>(null)
    const multiInputRef = useRef<HTMLInputElement>(null)
    const [deletedImages, setDeletedImages] = useState<string[]>([])
    const [newImages, setNewImages] = useState<File[]>([])

    // Initialize from value prop
    useEffect(() => {
        if (!value) return

        if (typeof value === "string") {
            // Single image
            if (value) {
                fetch(value)
                    .then((response) => response.blob())
                    .then((blob) => {
                        const file = new File([blob], `image-${Date.now()}`, {
                            type: blob.type,
                        })

                        setSingleImage({
                            id: crypto.randomUUID(),
                            file,
                            preview: value,
                            isNew: false,
                        })
                    })
                    .catch((error) => console.error("Failed to load image:", error))
            }
        } else if (Array.isArray(value)) {
            // Multiple images
            Promise.all(
                value.map(async (url) => {
                    try {
                        const response = await fetch(url)
                        const blob = await response.blob()
                        const file = new File([blob], `image-${Date.now()}`, {
                            type: blob.type,
                        })

                        return {
                            id: crypto.randomUUID(),
                            file,
                            preview: url,
                            isNew: false,
                        }
                    } catch (error) {
                        console.error("Failed to load image:", error)

                        return null
                    }
                }),
            ).then((loadedImages) => {
                setMultiImages(loadedImages.filter(Boolean) as ImageFile[])
            })
        }
    }, [value])

    // Handle mode change
    const handleModeChange = (newMode: "single" | "multiple") => {
        setMode(newMode)

        // Notify parent component of the change
        if (newMode === "single") {
            onChange?.(singleImage?.file || null)
        } else {
            onChange?.(multiImages.map((img) => img.file))
        }
    }

    // Single image handlers
    const handleSingleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null

        if (file) {
            const reader = new FileReader()

            reader.onloadend = () => {
                // If there was a previous image from a URL, add it to deletedImages
                if (singleImage && !singleImage.isNew && typeof value === "string") {
                    const updatedDeletedImages = [...deletedImages, value]
                    setDeletedImages(updatedDeletedImages)
                }

                const newImage = {
                    id: crypto.randomUUID(),
                    file,
                    preview: reader.result as string,
                    isNew: true,
                }

                setSingleImage(newImage)
                onChange?.(file)

                // Track new image
                const updatedNewImages = [file]
                setNewImages(updatedNewImages)
                onImagesChange?.({
                    deletedImages: typeof value === "string" ? [...deletedImages, value] : deletedImages,
                    newImages: updatedNewImages,
                })
            }
            reader.readAsDataURL(file)
        }
    }

    // Fix the clearSingleImage function to properly reset the newImages state when removing a single image
    const clearSingleImage = (e?: React.MouseEvent) => {
        e?.stopPropagation()

        // Track deleted image if it came from a URL
        if (singleImage && !singleImage.isNew && typeof value === "string") {
            const updatedDeletedImages = [...deletedImages, value]
            setDeletedImages(updatedDeletedImages)
            onImagesChange?.({ deletedImages: updatedDeletedImages, newImages: [] })
        } else if (singleImage?.isNew) {
            // If it was a new upload, clear newImages
            setNewImages([])
            onImagesChange?.({ deletedImages, newImages: [] })
        }

        setSingleImage(null)
        onChange?.(null)
        if (singleInputRef.current) {
            singleInputRef.current.value = ""
        }
    }

    // Multi image handlers
    const handleMultiFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || [])

        // Track new files
        const updatedNewImages = [...newImages, ...selectedFiles]
        setNewImages(updatedNewImages)
        onImagesChange?.({ deletedImages, newImages: updatedNewImages })

        addNewImages(selectedFiles)
    }

    const addNewImages = (selectedFiles: File[]) => {
        // Check if adding these files would exceed the maximum
        if (multiImages.length + selectedFiles.length > maxImages) {
            alert(`You can only upload a maximum of ${maxImages} images.`)
            selectedFiles = selectedFiles.slice(0, maxImages - multiImages.length)
        }

        selectedFiles.forEach((file) => {
            const reader = new FileReader()

            reader.onloadend = () => {
                const newImage: ImageFile = {
                    id: crypto.randomUUID(),
                    file,
                    preview: reader.result as string,
                    isNew: true,
                }

                setMultiImages((prev) => {
                    const updatedImages = [...prev, newImage]

                    // Notify parent component of change
                    onChange?.(updatedImages.map((img) => img.file))

                    return updatedImages
                })
            }
            reader.readAsDataURL(file)
        })
    }

    // Fix the removeImage function to properly update the newImages state
    const removeImage = (idToRemove: string) => {
        const imageToRemove = multiImages.find((img) => img.id === idToRemove)

        if (!imageToRemove) return

        // If the image was from a URL (part of the initial value), track it as deleted
        if (!imageToRemove.isNew && Array.isArray(value)) {
            const originalUrl = value.find((url) => url === imageToRemove.preview)
            if (originalUrl) {
                const updatedDeletedImages = [...deletedImages, originalUrl]
                setDeletedImages(updatedDeletedImages)
                onImagesChange?.({
                    deletedImages: updatedDeletedImages,
                    newImages,
                })
            }
        } else if (imageToRemove.isNew) {
            // If it was a new upload, remove it from newImages
            const fileToRemove = imageToRemove.file
            const updatedNewImages = newImages.filter((file) => file !== fileToRemove)
            setNewImages(updatedNewImages)
            onImagesChange?.({
                deletedImages,
                newImages: updatedNewImages,
            })
        }

        // Update the multiImages state
        setMultiImages((prev) => {
            const updatedImages = prev.filter((img) => img.id !== idToRemove)
            onChange?.(updatedImages.map((img) => img.file))
            return updatedImages
        })
    }

    // Fix the clearAllImages function to properly reset the newImages state
    const clearAllImages = () => {
        if (confirm("Are you sure you want to remove all images?")) {
            // Track all deleted images that came from URLs
            if (Array.isArray(value)) {
                const urlsToDelete = multiImages
                    .filter((img) => !img.isNew && value.includes(img.preview))
                    .map((img) => img.preview)

                if (urlsToDelete.length > 0) {
                    const updatedDeletedImages = [...deletedImages, ...urlsToDelete]
                    setDeletedImages(updatedDeletedImages)
                    onImagesChange?.({
                        deletedImages: updatedDeletedImages,
                        newImages: [],
                    })
                } else {
                    onImagesChange?.({
                        deletedImages,
                        newImages: [],
                    })
                }
            }

            setMultiImages([])
            // Reset newImages when clearing all images
            setNewImages([])
            onChange?.([])
        }
    }

    // Shared handlers
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))

        if (files.length > 0) {
            // Track new files
            const updatedNewImages = [...newImages, ...files]
            setNewImages(updatedNewImages)
            onImagesChange?.({ deletedImages, newImages: updatedNewImages })

            if (mode === "single") {
                const file = files[0]
                const reader = new FileReader()

                reader.onloadend = () => {
                    // If there was a previous image from a URL, add it to deletedImages
                    if (singleImage && !singleImage.isNew && typeof value === "string") {
                        const updatedDeletedImages = [...deletedImages, value]
                        setDeletedImages(updatedDeletedImages)
                        onImagesChange?.({
                            deletedImages: updatedDeletedImages,
                            newImages: updatedNewImages,
                        })
                    }

                    const newImage = {
                        id: crypto.randomUUID(),
                        file,
                        preview: reader.result as string,
                        isNew: true,
                    }

                    setSingleImage(newImage)
                    onChange?.(file)
                }
                reader.readAsDataURL(file)
            } else {
                addNewImages(files)
            }
        }
    }

    // Lightbox handlers
    const openLightbox = (index: number) => {
        setLightbox({ isOpen: true, imageIndex: index })
        setZoomLevel(1) // Reset zoom level when opening
    }

    const handleZoomIn = () => {
        setZoomLevel((prev) => Math.min(prev + 0.25, 3))
    }

    const handleZoomOut = () => {
        setZoomLevel((prev) => Math.max(prev - 0.25, 0.5))
    }

    const handleResetZoom = () => {
        setZoomLevel(1)
    }

    const navigateImages = (direction: "next" | "prev") => {
        setLightbox((prev) => {
            let newIndex = prev.imageIndex
            const totalImages = mode === "single" ? 1 : multiImages.length

            if (direction === "next") {
                newIndex = (newIndex + 1) % totalImages
            } else {
                newIndex = (newIndex - 1 + totalImages) % totalImages
            }

            return { ...prev, imageIndex: newIndex }
        })
        setZoomLevel(1) // Reset zoom when changing images
    }

    // Get current images for lightbox
    const getCurrentImages = () => {
        return mode === "single" ? (singleImage ? [singleImage] : []) : multiImages
    }

    return (
        <div className={cn("space-y-4", className)}>
            {showModeToggle && (
                <Tabs
                    className="w-full"
                    value={mode}
                    onValueChange={(value: any) => handleModeChange(value as "single" | "multiple")}
                >
                    <div className="mb-2 flex items-center justify-between">
                        <Label className="text-sm font-semibold">{label}</Label>
                        <TabsList>
                            <TabsTrigger className="text-xs" value="single">
                                Single Image
                            </TabsTrigger>
                            <TabsTrigger className="text-xs" value="multiple">
                                Multiple Images
                            </TabsTrigger>
                        </TabsList>
                    </div>
                </Tabs>
            )}

            {!showModeToggle && (
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">{label}</Label>
                    {mode === "multiple" && (
                        <span className="text-muted-foreground text-xs">
                            {multiImages.length} / {maxImages} images
                        </span>
                    )}
                </div>
            )}

            {/* Single Image Upload */}
            {mode === "single" && (
                <div
                    className={cn(
                        "border-2 border-dashed rounded-lg transition-colors",
                        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20",
                        singleImage ? "p-2" : "p-8",
                    )}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    {singleImage ? (
                        <div className="relative flex">
                            <button
                                type="button"
                                className="group relative mx-auto aspect-square w-full max-w-[200px] cursor-pointer overflow-hidden rounded-lg"
                                onClick={() => openLightbox(0)}
                            >
                                <img
                                    alt="Preview"
                                    className="object-cover transition-transform"
                                    src={singleImage.preview || "/placeholder.svg"}
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                                    <IconZoomIn className="size-8 text-white" />
                                </div>
                            </button>
                            <Button
                                className="absolute -right-2 -top-2 size-6 rounded-full"
                                size="icon"
                                type="button"
                                variant="destructive"
                                onClick={clearSingleImage}
                            >
                                <IconX className="size-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center">
                            <IconPhoto className="text-muted-foreground mb-2 size-10" />
                            <p className="mb-1 text-sm font-medium">Drag & drop your image here</p>
                            <p className="text-muted-foreground mb-4 text-xs">or click to browse</p>
                            <Button size="sm" type="button" variant="secondary" onClick={() => singleInputRef.current?.click()}>
                                Choose File
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Multiple Image Upload */}
            {mode === "multiple" && (
                <div
                    className={cn(
                        "border-2 border-dashed rounded-lg transition-colors",
                        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20",
                        multiImages.length > 0 ? "p-4" : "p-8",
                    )}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    {multiImages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center">
                            <IconUpload className="text-muted-foreground mb-2 size-10" />
                            <p className="mb-1 text-sm font-medium">Drag & drop your images here</p>
                            <p className="text-muted-foreground mb-4 text-xs">or click to browse</p>
                            <Button size="sm" type="button" variant="secondary" onClick={() => multiInputRef.current?.click()}>
                                Choose Files
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Image grid */}
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                {multiImages.map((image, index) => (
                                    <div key={image.id} className="group relative aspect-square">
                                        <button
                                            type="button"
                                            className="relative size-full cursor-pointer overflow-hidden rounded-lg"
                                            onClick={() => openLightbox(index)}
                                        >
                                            <img
                                                alt={`Image ${index + 1}`}
                                                className="object-cover"
                                                src={image.preview || "/placeholder.svg"}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                                                <IconZoomIn className="size-8 text-white" />
                                            </div>
                                        </button>
                                        <Button
                                            className="absolute -right-2 -top-2 size-6 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                                            size="icon"
                                            type="button"
                                            variant="destructive"
                                            onClick={(e: any) => {
                                                e.stopPropagation()
                                                removeImage(image.id)
                                            }}
                                        >
                                            <IconX className="size-4" />
                                        </Button>
                                    </div>
                                ))}

                                {/* Add more button */}
                                {multiImages.length < maxImages && (
                                    <button
                                        type="button"
                                        className="hover:bg-muted/50 relative flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors"
                                        onClick={() => multiInputRef.current?.click()}
                                    >
                                        <div className="flex flex-col items-center justify-center p-2 text-center">
                                            <IconUpload className="text-muted-foreground mb-1 size-8" />
                                            <p className="text-muted-foreground text-xs">Add More</p>
                                        </div>
                                    </button>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between">
                                <Button
                                    className="text-destructive hover:text-destructive"
                                    size="sm"
                                    type="button"
                                    variant="outline"
                                    onClick={clearAllImages}
                                >
                                    <IconTrash className="mr-2 size-4" />
                                    Remove All
                                </Button>

                                <Button
                                    disabled={multiImages.length >= maxImages}
                                    size="sm"
                                    type="button"
                                    variant="outline"
                                    onClick={() => multiInputRef.current?.click()}
                                >
                                    Add More
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Hidden file inputs */}
            <Input ref={singleInputRef} accept="image/*" className="hidden" type="file" onChange={handleSingleFileChange} />

            <Input
                ref={multiInputRef}
                multiple
                accept="image/*"
                className="hidden"
                type="file"
                onChange={handleMultiFileChange}
            />

            {/* Image Lightbox */}
            <Dialog open={lightbox.isOpen} onOpenChange={(open: any) => setLightbox({ ...lightbox, isOpen: open })}>
                <DialogContent className="size-fit max-h-[90vh] max-w-[90vw] overflow-hidden p-0">
                    <div className="relative flex h-full flex-col bg-black/90">
                        <div className="absolute right-2 top-2 z-10 flex gap-2">
                            <Button
                                type="button"
                                className="size-8 border-0 bg-black/50 text-white hover:bg-black/70"
                                size="icon"
                                variant="outline"
                                onClick={handleZoomOut}
                            >
                                <IconZoomOut className="size-4" />
                            </Button>
                            <Button
                                type="button"
                                className="size-8 border-0 bg-black/50 text-white hover:bg-black/70"
                                size="icon"
                                variant="outline"
                                onClick={handleZoomIn}
                            >
                                <IconZoomIn className="size-4" />
                            </Button>
                            <Button
                                type="button"
                                className="size-8 border-0 bg-black/50 text-white hover:bg-black/70"
                                size="icon"
                                variant="outline"
                                onClick={handleResetZoom}
                            >
                                {zoomLevel !== 1 ? <IconMinimize className="size-4" /> : <IconMinimize className="size-4" />}
                            </Button>
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    className="size-8 border-0 bg-black/50 text-white hover:bg-black/70"
                                    size="icon"
                                    variant="outline"
                                >
                                    <IconX className="size-4" />
                                </Button>
                            </DialogClose>
                        </div>

                        {/* Navigation buttons */}
                        {mode === "multiple" && multiImages.length > 1 && (
                            <>
                                <Button
                                    type="button"
                                    className="absolute left-2 top-1/2 z-10 size-10 -translate-y-1/2 rounded-full border-0 bg-black/50 text-white hover:bg-black/70"
                                    size="icon"
                                    variant="outline"
                                    onClick={() => navigateImages("prev")}
                                >
                                    <svg
                                        className="lucide lucide-chevron-left"
                                        fill="none"
                                        height="24"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="m15 18-6-6 6-6" />
                                    </svg>
                                </Button>
                                <Button
                                    type="button"
                                    className="absolute right-2 top-1/2 z-10 size-10 -translate-y-1/2 rounded-full border-0 bg-black/50 text-white hover:bg-black/70"
                                    size="icon"
                                    variant="outline"
                                    onClick={() => navigateImages("next")}
                                >
                                    <svg
                                        className="lucide lucide-chevron-right"
                                        fill="none"
                                        height="24"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="m9 18 6-6-6-6" />
                                    </svg>
                                </Button>
                            </>
                        )}

                        <div className="flex flex-1 items-center justify-center overflow-auto p-4">
                            {getCurrentImages().length > 0 && lightbox.imageIndex < getCurrentImages().length && (
                                <div
                                    className="relative flex size-full items-center justify-center overflow-auto"
                                    style={{ padding: zoomLevel > 1 ? "2rem" : 0 }}
                                >
                                    <img
                                        alt={`Image ${lightbox.imageIndex + 1}`}
                                        className="max-h-[80vh] object-contain transition-transform"
                                        src={getCurrentImages()[lightbox.imageIndex].preview || "/placeholder.svg"}
                                        style={{
                                            transform: `scale(${zoomLevel})`,
                                            transformOrigin: "center",
                                            transition: "transform 0.2s ease-out",
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between bg-black/80 px-3 text-sm text-white">
                            {mode === "multiple" ? (
                                <span>
                                    Image {lightbox.imageIndex + 1} of {multiImages.length}
                                </span>
                            ) : (
                                <span>Image Preview</span>
                            )}
                            <span>Zoom: {Math.round(zoomLevel * 100)}%</span>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
