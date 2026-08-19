export interface ShippingInfo {
  type:
    | "pickup"
    | "andreani_domicilio"
    | "andreani_sucursal"
    | "treggo"
    | "other";

  title: string;
  subtitle: string;
}

export function getShippingInfo(
  shippingDescription: string,
): ShippingInfo {
  if (!shippingDescription) {
    return {
      type: "other",
      title: "-",
      subtitle: "",
    };
  }

  const shipping = shippingDescription.trim();

  // ==========================
  // PICKUP
  // ==========================
  if (shipping.startsWith("amt - Retiro en tienda")) {
    const parts = shipping.split(" - ");

    return {
      type: "pickup",
      title: "Retiro PickUp",
      subtitle:
        parts.length >= 3
          ? parts[2].trim()
          : "",
    };
  }

  // ==========================
  // TREGGO
  // ==========================
  if (
    shipping.startsWith(
      "Envío rápido por Treggo"
    )
  ) {
    return {
      type: "treggo",
      title: "Treggo",
      subtitle: "Envío a domicilio",
    };
  }

  // ==========================
  // ANDREANI DOMICILIO
  // ==========================
  if (
    shipping.startsWith(
      "Andreani - Envio a domicilio"
    )
  ) {
    return {
      type: "andreani_domicilio",
      title: "Andreani Domicilio",
      subtitle: "Envío a domicilio",
    };
  }

  // ==========================
  // ANDREANI SUCURSAL
  // ==========================
  if (
    shipping.startsWith(
      "Andreani - Retiro en sucursal"
    )
  ) {
    return {
      type: "andreani_sucursal",
      title: "Andreani Sucursal",
      subtitle: "Retiro en sucursal",
    };
  }

  // ==========================
  // DEFAULT
  // ==========================
  return {
    type: "other",
    title: shipping,
    subtitle: "",
  };
}