import { redirect } from "next/navigation";

export default function MissingProductsRedirect() {
  redirect("/productos-faltantes");
}
