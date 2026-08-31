import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return <div className="page-width not-found"><p className="eyebrow">Error 404</p><h1>This page has moved on.</h1><p>The address may be incorrect, or the piece you were looking for is no longer in the edit.</p><div><Button asChild><Link href="/products">Shop all products</Link></Button><Button asChild variant="outline"><Link href="/">Return home</Link></Button></div></div>;
}
