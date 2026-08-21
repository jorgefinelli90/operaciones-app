import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@supabase/supabase-js";

import {
  supabaseAdmin,
} from "@/lib/supabase/serverAdmin";

/*
 * ============================================================
 * POST /api/users
 * ============================================================
 *
 * Crea:
 *
 * 1. Usuario en Supabase Auth
 * 2. Perfil en public.profiles
 *
 * Solo ADMIN.
 */

export async function POST(
  request: Request,
) {
  try {
    /*
     * ========================================================
     * 1. OBTENER TOKEN
     * ========================================================
     */

    const authorization =
      request.headers.get(
        "authorization",
      );

    if (!authorization) {
      return NextResponse.json(
        {
          error:
            "No autenticado.",
        },
        {
          status: 401,
        },
      );
    }

    const token =
      authorization.replace(
        /^Bearer\s+/i,
        "",
      );

    if (!token) {
      return NextResponse.json(
        {
          error:
            "Token inválido.",
        },
        {
          status: 401,
        },
      );
    }

    /*
     * ========================================================
     * 2. CLIENTE AUTENTICADO
     * ========================================================
     *
     * Este cliente utiliza el JWT del usuario.
     */

    const supabaseAuth =
      createClient(
        process.env
          .NEXT_PUBLIC_SUPABASE_URL!,
        process.env
          .NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

    /*
     * ========================================================
     * 3. OBTENER USUARIO AUTH
     * ========================================================
     */

    const {
      data: {
        user: currentAuthUser,
      },
      error: authError,
    } =
      await supabaseAuth.auth.getUser();

    if (
      authError ||
      !currentAuthUser
    ) {
      return NextResponse.json(
        {
          error:
            "Sesión inválida.",
        },
        {
          status: 401,
        },
      );
    }

    /*
     * ========================================================
     * 4. OBTENER PROFILE DEL ADMIN
     * ========================================================
     */

    const {
      data: currentProfile,
      error: profileError,
    } =
      await supabaseAdmin
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
        .eq(
          "id",
          currentAuthUser.id,
        )
        .single();

    if (
      profileError ||
      !currentProfile
    ) {
      console.error(
        "Error obteniendo profile del admin:",
        profileError,
      );

      return NextResponse.json(
        {
          error:
            "No se pudo verificar el usuario.",
        },
        {
          status: 403,
        },
      );
    }

    /*
     * ========================================================
     * 5. VALIDAR ADMIN
     * ========================================================
     */

    const role =
      Array.isArray(
        currentProfile.role,
      )
        ? currentProfile.role[0]
        : currentProfile.role;

    if (
      !currentProfile.active ||
      role?.code !== "ADMIN"
    ) {
      return NextResponse.json(
        {
          error:
            "No tenés permisos para administrar usuarios.",
        },
        {
          status: 403,
        },
      );
    }

    /*
     * ========================================================
     * 6. LEER BODY
     * ========================================================
     */

    const body =
      await request.json();

    const {
      name,
      email,
      roleId,
      password,
    } = body;

    /*
     * ========================================================
     * 7. VALIDACIONES
     * ========================================================
     */

    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "El nombre es obligatorio.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      typeof email !== "string" ||
      !email.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "El email es obligatorio.",
        },
        {
          status: 400,
        },
      );
    }

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

    /*
     * ========================================================
     * 8. VALIDAR ROL
     * ========================================================
     */

    const {
      data: selectedRole,
      error: selectedRoleError,
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
      selectedRoleError ||
      !selectedRole
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

    /*
     * ========================================================
     * 9. NORMALIZAR EMAIL
     * ========================================================
     */

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    /*
     * ========================================================
     * 10. VERIFICAR EMAIL EXISTENTE
     * ========================================================
     */

    const {
      data: existingProfile,
    } =
      await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq(
          "email",
          normalizedEmail,
        )
        .maybeSingle();

    if (existingProfile) {
      return NextResponse.json(
        {
          error:
            "Ya existe un usuario con ese email.",
        },
        {
          status: 409,
        },
      );
    }

    /*
     * ========================================================
     * 11. CREAR AUTH USER
     * ========================================================
     */

    const {
      data: createdAuth,
      error: createAuthError,
    } =
      await supabaseAdmin.auth.admin.createUser(
        {
          email:
            normalizedEmail,

          password,

          email_confirm: true,

          user_metadata: {
            name: name.trim(),
          },
        },
      );

    if (
      createAuthError ||
      !createdAuth.user
    ) {
      console.error(
        "Error creando usuario Auth:",
        createAuthError,
      );

      return NextResponse.json(
        {
          error:
            createAuthError?.message ||
            "No se pudo crear el usuario.",
        },
        {
          status: 400,
        },
      );
    }

    const authUser =
      createdAuth.user;

    /*
     * ========================================================
     * 12. CREAR PROFILE
     * ========================================================
     */

    const {
      data: createdProfile,
      error: createProfileError,
    } =
      await supabaseAdmin
        .from("profiles")
        .insert({
          id: authUser.id,

          email:
            normalizedEmail,

          name: name.trim(),

          role_id:
            selectedRole.id,

          active: true,
        })
        .select(
          `
            id,
            email,
            name,
            role_id,
            active,
            created_at,
            updated_at
          `,
        )
        .single();

    /*
     * ========================================================
     * 13. ROLLBACK AUTH
     * ========================================================
     */

    if (
      createProfileError ||
      !createdProfile
    ) {
      console.error(
        "Error creando profile:",
        createProfileError,
      );

      /*
       * Si Auth se creó pero profile falló,
       * eliminamos el usuario Auth.
       */

      const {
        error:
          rollbackError,
      } =
        await supabaseAdmin.auth.admin.deleteUser(
          authUser.id,
        );

      if (rollbackError) {
        console.error(
          "ERROR CRÍTICO: no se pudo hacer rollback del usuario Auth:",
          rollbackError,
        );
      }

      return NextResponse.json(
        {
          error:
            "No se pudo crear el perfil del usuario.",
        },
        {
          status: 500,
        },
      );
    }

    /*
     * ========================================================
     * 14. RESPUESTA
     * ========================================================
     */

    return NextResponse.json(
      {
        success: true,

        user: {
          ...createdProfile,

          role:
            selectedRole,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Error inesperado creando usuario:",
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