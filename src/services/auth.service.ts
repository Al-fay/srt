import type { DataTableQueryParams } from "@/components/data-table";
import type { ComboboxOption } from "@/components/form/combobox-field";
import { api } from "@/lib/api";
import { encrypt } from "@/lib/crypto";
import type ApiResponse from "@/types/api";
import type {
  changePasswordForm,
  DataAktivasi,
  GetUsersResponse,
  LoginForm,
  MeResponse,
  ResetPassword,
  SignInResponse,
  UpdateUser,
  UpdateUserResponse,
  UserFormData,
} from "@/types/user";

export async function getUsers(
  params?: Partial<DataTableQueryParams>,
): Promise<GetUsersResponse> {
  try {
    const queryParams: Record<string, string | number | boolean> = {};

    if (params?.page !== undefined) queryParams.page = params.page;
    if (params?.limit !== undefined) queryParams.size = params.limit;
    if (params?.search) queryParams.search = params.search;
    if (params?.sortBy) queryParams.sortBy = params.sortBy;
    if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;

    if (params?.filters) {
      Object.entries(params.filters).forEach(([k, v]) => {
        if (v) queryParams[k] = v;
      });
    }

    const res = await api<GetUsersResponse>("/auth/users", {
      params: queryParams,
    });

    return { ...res, error: null };
  } catch (error: any) {
    return {
      success: false,
      data: [],
      total: 0,
      page: 0,
      size: 0,
      timestamp: new Date().toISOString(),
      error: error.response,
    };
  }
}

export async function getDtBagianOptions() {
  const response = await api<ApiResponse<ComboboxOption[]>>("/auth/dtbag");

  return response.data;
}

export async function signInService(value: LoginForm): Promise<SignInResponse> {
  const payload = {
    xpass_id: encrypt(value.xpass_id),
    xpass_wd: encrypt(value.xpass_wd),
  };

  // console.log("PAYLOAD : ", payload)

  return api<SignInResponse>("/auth/signin", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function signUpService(value: UserFormData) {
  const payload = encrypt({
    xpass_id: value.xpass_id,
    xpass_name: value.xpass_name,
    // xpass_wd: value.xpass_wd,
    xbagian: value.xbagian,
    xwil_code: value.xwil_code,
    xnip: value.xnip,
    xnohp: value.xnohp,
  });

  // console.log("Payload ", payload)

  return api("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ payload }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function signOutService() {
  try {
    return await api("/auth/signout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("Error logout", error);
    throw error;
  }
}

export async function meService(): Promise<MeResponse> {
  return api("/auth/me", {
    method: "GET",
  });
}

export async function checkAuth() {
  try {
    await api("/auth/me");

    return {
      authenticated: true,
      error: null,
    };
  } catch (error: any) {
    return {
      authenticated: false,
      error: error.response,
    };
  }
}

export async function changePassword(value: changePasswordForm) {
  const payload = encrypt({
    xpil: value.xpil,
    xpass_id: value.xpass_id,
    xpass_wd: value.xpass_wd,
    xcpass_wd: value.xcpass_wd,
  });

  // console.log("Payload : ", payload)

  return api("/auth/update", {
    method: "PATCH",
    body: JSON.stringify({
      payload,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function aktivasiUser(value: DataAktivasi) {
  const payload = encrypt({
    xpass_id: value.xpass_id,
    xpass_wd: value.xpass_wd,
    xcpass_wd: value.xcpass_wd,
    xbagian: value.xbagian,
    xnip: value.xnip,
    xnohp: value.xnohp,
  });

  // console.log("Payload : ", payload)

  return api("/auth/aktivasi", {
    method: "POST",
    body: JSON.stringify({ payload }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function resetPassword(value: ResetPassword) {
  const payload = encrypt({
    xpass_id: value.xpass_id,
    xpil: 1,
  });

  // console.log("Payload ", payload)

  return api("/auth/reset", {
    method: "PATCH",
    body: JSON.stringify({ payload }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function AktivasiUserViaAdm(value: UpdateUser) {
  const payload = encrypt({
    xpass_id: value.xpass_id,
    aktiv: value.aktiv,
    xpil: value.xpil,
  });

  // console.log("Payload : ", payload)

  return api("/auth/update", {
    method: "PATCH",
    body: JSON.stringify({ payload }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function getUserById(xpass_id: string) {
  return api<MeResponse>(`/auth/user/${xpass_id}`, {
    method: "GET",
  });
}

export async function UpdateUser(value: UpdateUser) {
  const payload = encrypt({
    xpass_id: value.xpass_id,
    xpass_wd: value.xpass_wd,
    xcpass_wd: value.xcpass_wd,
    xpass_name: value.xpass_name,
    xbagian: value.xbagian,
    xnip: value.xnip,
    xnohp: value.xnohp,
    lv_user: value.lv_user,
    aktiv: value.aktiv,
    xpil: value.xpil,
  });

  console.log("Payload : ", payload);

  return api<UpdateUserResponse>("/auth/update", {
    method: "PATCH",
    body: JSON.stringify({ payload }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
