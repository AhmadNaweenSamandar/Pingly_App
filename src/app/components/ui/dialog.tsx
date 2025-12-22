"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "./utils";

/**
 * Dialog (Root)
 * * The top-level state manager.
 * * Manages the 'open' state and context for all children.
 */

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}


/**
 * Dialog Trigger
 * * The element (usually a button) that opens the dialog when clicked.
 * * Automatically handles ARIA attributes (e.g., aria-expanded).
 */

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}


/**
 * Dialog Portal
 * * Renders the dialog content into the <body> element (or a specific container).
 * * Crucial for avoiding z-index and overflow issues in complex layouts.
 */

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}


/**
 * Dialog Close
 * * A helper button primitive that closes the dialog when clicked.
 * * Often used inside the content area for custom cancel buttons.
 */
function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}


/**
 * Dialog Overlay
 * * The semi-transparent dark background that covers the screen.
 * * Handles the fade-in/out animations based on open state.
 */
function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        // Layout: Fixed to cover the entire viewport
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        // Animation: Fade in when opening, Fade out when closing
        className,
      )}
      {...props}
    />
  );
}


/**
 * Dialog Content
 * * The actual white modal box.
 * * Includes the Overlay automatically via the Portal.
 * * Handles the "Zoom" entrance animation and "Absolute Centering".
 */
function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal data-slot="dialog-portal">
      {/* Automatically render the overlay whenever content is shown */}
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
        // --- Layout & Positioning ---
        // --- Animations ---
        // Combines Fading with a slight Zoom effect (95% -> 100%)
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className,
        )}
        {...props}
      >
        {children}

        {/* --- Built-in Close Button (Top Right) --- */}
        <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}


/**
 * Dialog Header
 * * Semantic wrapper for Title and Description.
 * * Handles responsive text alignment (Center on mobile, Left on desktop).
 */
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}


/**
 * Dialog Footer
 * * Wrapper for action buttons (Cancel/Submit).
 * * Handles responsive flex direction (Vertical stack on mobile, Row on desktop).
 */
function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}


/**
 * Dialog Title
 * * The main heading of the modal.
 * * Automatically linked to the dialog for Screen Readers via ARIA.
 */
function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}



/**
 * Dialog Description
 * * Subtext for the modal.
 * * Automatically linked to the dialog for Screen Readers via ARIA.
 */
function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};