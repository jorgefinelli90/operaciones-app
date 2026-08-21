import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { supabaseAdmin } from "@/lib/supabase/serverAdmin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function getAdminFromRequest(
  request: Request,
) {
  const authorization =
    request.headers.get("authorization");

  if (!authorization) {
    return {
      error: "No autenticado.",
      status: 401,
    };
  }

  const token = authorization.replace(
    /^Bearer\s+/i,
    "",
  );

  if (!token) {
    return {
      error: "Token inválido.",
      status: 401,
    };
  }

  const supabaseAuth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  const {
    data: {
      user: authUser,
    },
    error: authError,
  } = await supabaseAuth.auth.getUser();

  if (authError || !authUser) {
    return {
      error: "Sesión inválida.",
      status: 401,
    };
  }

  const {
    data: profile,
    error: profileError,
  } = await supabaseAdmin
    .from("profiles")
    .select(
      `
        id,
        role_id,
        active,
        role:roles (
          id,
          code,
          name
        )
      `,
    )
    .eq("id", authUser.id)
    .single();

  if (profileError || !profile) {
    return {
      error: "No se pudo verificar el usuario.",
      status: 403,
    };
  }

  const role = Array.isArray(profile.role)
    ? profile.role[0]
    : profile.role;

  if (
    !profile.active ||
    role?.code !== "ADMIN"
  ) {
    return {
      error:
        "No tenés permisos para administrar usuarios.",
      status: 403,
    };
  }

  return {
    authUser,
    profile,
  };
}

/*
 * ============================================================
 * PATCH /api/users/[id]
 * ============================================================
 */

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const admin =
      await getAdminFromRequest(request);

    if ("error" in admin) {
      return NextResponse.json(
        {
          error: admin.error,
        },
        {
          status: admin.status,
        },
      );
    }

    const { id } =
      await context.params;

    if (!id) {
      return NextResponse.json(
        {
          error:
            "ID de usuario inválido.",
        },
        {
          status: 400,
        },
      );
    }

    const body =
      await request.json();

    const {
      name,
      roleId,
      active,
      password,
    } = body;

    /*
     * ========================================================
     * VALIDAR USUARIO OBJETIVO
     * ========================================================
     */

    const {
      data: targetUser,
      error: targetError,
    } = await supabaseAdmin
      .from("profiles")
      .select(
        `
          id,
          email,
          name,
          role_id,
          active,
          role:roles (
            id,
            code,
            name
          )
        `,
      )
      .eq("id", id)
      .single();

    if (
      targetError ||
      !targetUser
    ) {
      return NextResponse.json(
        {
          error:
            "Usuario no encontrado.",
        },
        {
          status: 404,
        },
      );
    }

    const targetRole =
      Array.isArray(
        targetUser.role,
      )
        ? targetUser.role[0]
        : targetUser.role;

    const isSelf =
      admin.authUser.id === id;

    /*
     * ========================================================
     * REGLA CRÍTICA:
     *
     * ADMIN NO PUEDE:
     *
     * - quitarse ADMIN
     * - desactivarse
     * ========================================================
     */

    if (isSelf) {
      if (
        roleId !== undefined &&
        Number(roleId) !==
          Number(targetUser.role_id)
      ) {
        return NextResponse.json(
          {
            error:
              "No podés cambiar tu propio rol.",
          },
          {
            status: 403,
          },
        );
      }

      if (
        active !== undefined &&
        active === false
      ) {
        return NextResponse.json(
          {
            error:
              "No podés desactivar tu propia cuenta.",
          },
          {
            status: 403,
          },
        );
      }
    }

    /*
     * ========================================================
     * VALIDAR NOMBRE
     * ========================================================
     */

    if (
      name !== undefined
    ) {
      if (
        typeof name !== "string" ||
        !name.trim()
      ) {
        return NextResponse.json(
          {
            error:
              "El nombre no puede estar vacío.",
          },
          {
            status: 400,
          },
        );
      }
    }

    /*
     * ========================================================
     * VALIDAR ACTIVE
     * ========================================================
     */

    if (
      active !== undefined &&
      typeof active !== "boolean"
    ) {
      return NextResponse.json(
        {
          error:
            "El estado del usuario no es válido.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * ========================================================
     * VALIDAR ROLE
     * ========================================================
     */

    let selectedRole = null;

    if (
      roleId !== undefined
    ) {
      const parsedRoleId =
        Number(roleId);

      if (
        !Number.isInteger(
          parsedRoleId,
        )
      ) {
        return NextResponse.json(
          {
            error:
              "El rol seleccionado no es válido.",
          },
          {
            status: 400,
          },
        );
      }

      const {
        data: role,
        error: roleError,
      } =
        await supabaseAdmin
          .from("roles")
          .select(
            "id, code, name",
          )
          .eq(
            "id",
            parsedRoleId,
          )
          .single();

      if (
        roleError ||
        !role
      ) {
        return NextResponse.json(
          {
            error:
              "El rol seleccionado no existe.",
          },
          {
            status: 400,
          },
        );
      }

      selectedRole = role;

      /*
       * Seguridad adicional:
       *
       * Si el usuario se está modificando a sí mismo,
       * solamente puede conservar ADMIN.
       */

      if (
        isSelf &&
        role.code !== "ADMIN"
      ) {
        return NextResponse.json(
          {
            error:
              "No podés quitarte el rol de Administrador.",
          },
          {
            status: 403,
          },
        );
      }
    }

    /*
     * ========================================================
     * VALIDAR PASSWORD
     * ========================================================
     */

    if (
      password !== undefined
    ) {
      if (
        typeof password !== "string" ||
        password.length < 8
      ) {
        return NextResponse.json(
          {
            error:
              "La contraseña debe tener al menos 8 caracteres.",
          },
          {
            status: 400,
          },
        );
      }
    }

    /*
     * ========================================================
     * ACTUALIZAR AUTH
     * ========================================================
     */

    if (
      password !== undefined
    ) {
      const {
        error:
          authUpdateError,
      } =
        await supabaseAdmin.auth.admin.updateUserById(
          id,
          {
            password,
          },
        );

      if (authUpdateError) {
        console.error(
          "Error actualizando contraseña:",
          authUpdateError,
        );

        return NextResponse.json(
          {
            error:
              authUpdateError.message ||
              "No se pudo cambiar la contraseña.",
          },
          {
            status: 400,
          },
        );
      }
    }

    /*
     * ========================================================
     * ACTUALIZAR PROFILE
     * ========================================================
     */

    const profileUpdate: Record<
      string,
      unknown
    > = {};

    if (
      name !== undefined
    ) {
      profileUpdate.name =
        name.trim();
    }

    if (
      roleId !== undefined
    ) {
      profileUpdate.role_id =
        Number(roleId);
    }

    if (
      active !== undefined
    ) {
      profileUpdate.active =
        active;
    }

    if (
      Object.keys(
        profileUpdate,
      ).length > 0
    ) {
      const {
        error:
          updateError,
      } =
        await supabaseAdmin
          .from("profiles")
          .update(
            profileUpdate,
          )
          .eq(
            "id",
            id,
          );

      if (updateError) {
        console.error(
          "Error actualizando profile:",
          updateError,
        );

        return NextResponse.json(
          {
            error:
              "No se pudo actualizar el usuario.",
          },
          {
            status: 500,
          },
        );
      }
    }

    /*
     * ========================================================
     * OBTENER RESULTADO FINAL
     * ========================================================
     */

    const {
      data: updatedUser,
      error:
        updatedUserError,
    } =
      await supabaseAdmin
        .from("profiles")
        .select(
          `
            id,
            email,
            name,
            role_id,
            active,
            created_at,
            updated_at,
            role:roles (
              id,
              code,
              name
            )
          `,
        )
        .eq(
          "id",
          id,
        )
        .single();

    if (
      updatedUserError ||
      !updatedUser
    ) {
      return NextResponse.json(
        {
          error:
            "Usuario actualizado, pero no se pudo recuperar el resultado.",
        },
        {
          status: 500,
        },
      );
    }

    const updatedRole =
      Array.isArray(
        updatedUser.role,
      )
        ? updatedUser.role[0]
        : updatedUser.role;

    return NextResponse.json(
      {
        success: true,

        user: {
          ...updatedUser,
          role: updatedRole,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Error actualizando usuario:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error interno del servidor.",
      },
      {
        status: 500,
      },
    );
  }
}