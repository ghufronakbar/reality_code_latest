import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  children: React.ReactNode;
}

interface BreadcrumbItemProps {
  children: React.ReactNode;
  isCurrentPage?: boolean;
  isFirst?: boolean;
}

interface BreadcrumbLinkProps {
  children: React.ReactNode;
  href: string;
}

export function Breadcrumb({ children }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">{children}</ol>
    </nav>
  );
}

export function BreadcrumbItem({
  children,
  isCurrentPage,
  isFirst = false,
}: BreadcrumbItemProps) {
  return (
    <li className="flex items-center">
      <div className="flex items-center">
        {!isFirst && (
          <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />
        )}
        <span
          className={
            isCurrentPage
              ? "text-foreground font-medium"
              : "text-muted-foreground"
          }
          aria-current={isCurrentPage ? "page" : undefined}
        >
          {children}
        </span>
      </div>
    </li>
  );
}

export function BreadcrumbLink({ children, href }: BreadcrumbLinkProps) {
  return (
    <Link href={href} className="hover:text-foreground">
      {children}
    </Link>
  );
}
