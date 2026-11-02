"use client";
import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Store } from "./store";
/**
 * Subscribes a component to the Store. `ready` is false on the server and during hydration, and
 * flips to true once the browser data (and demo data on first visit) has loaded, the same moment
 * the original pages waited for with Store.ready.then(...).
 * Components that read from Store during render re-render automatically whenever data changes.
 */
export function useStore() {
  const snap = useSyncExternalStore(Store.subscribe, Store.getSnapshot, Store.getServerSnapshot);
  return { ready: snap.ready, version: snap.v };
}
/** Signed-in student, or null while loading / after redirecting to sign in (staff go to /staff). */
export function useRequireUser() {
  const { ready } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const u = ready ? Store.currentUser() : null;
  useEffect(() => {
    if (!ready) return;
    if (!u) router.replace("/signin?next=" + encodeURIComponent(pathname + window.location.search));
    else if (u.isStaff) router.replace("/staff");
  }, [ready, u, router, pathname]);
  return ready && u && !u.isStaff ? u : null;
}
/** Signed-in staff member, or null while loading / after redirecting to sign in. */
export function useRequireStaff() {
  const { ready } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const u = ready ? Store.currentUser() : null;
  useEffect(() => {
    if (!ready) return;
    if (!u || !u.isStaff) router.replace("/signin?next=" + encodeURIComponent(pathname + window.location.search));
  }, [ready, u, router, pathname]);
  return ready && u && u.isStaff ? u : null;
}
/** Sets document.title from client-side data (the original set it after Store.ready). */
export function useDocumentTitle(title) {
  useEffect(() => {
    if (title) document.title = title;
  }, [title]);
}
/** True when sample/demo content should show. Always false until the browser data is ready, so server and first client render agree. */
export function useDemo() {
  const { ready } = useStore();
  return ready && Store.demo;
}
