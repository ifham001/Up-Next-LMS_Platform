import { showNotification } from "@/store/slices/common/notification-slice";
import { AppDispatch } from "@/store/Store";
import Cookies from "js-cookie";
const db = process.env.NEXT_PUBLIC_API_URL;

interface ApiEnvelope<T> {
    success: boolean;
    message?: string;
    data?: T;
}

interface Certificate {
    [key: string]: unknown;
}

interface IssueCertificateData {
    certificate: Certificate;
}

interface MyCertificatesData {
    certificates: Certificate[];
}

interface VerifyCertificateData {
    valid: boolean;
    [key: string]: unknown;
}

interface DownloadCertificateData {
    [key: string]: unknown;
}

// POST /user/certificates  AUTH  body { courseId } → data { certificate }
export const issueCertificateApi = async (
    courseId: string,
    dispatch: AppDispatch,
    setIsLoading?: (isLoading: boolean) => void
) => {
    setIsLoading?.(true);
    try {
        const response = await fetch(`${db}/user/certificates`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get('token')}`,
            },
            body: JSON.stringify({ courseId }),
        });
        const json: ApiEnvelope<IssueCertificateData> = await response.json();

        if (json.success) {
            dispatch(showNotification({ message: json.message ?? 'Certificate issued successfully', type: "success" }));
            return json.data?.certificate;
        }

        return dispatch(showNotification({ message: json.message ?? 'Failed to issue certificate', type: "error" }));
    } catch {
        return dispatch(showNotification({ message: 'Failed to issue certificate', type: "error" }));
    } finally {
        setIsLoading?.(false);
    }
};

// GET /user/certificates  AUTH  → data { certificates: [...] }
export const getMyCertificatesApi = async (
    dispatch?: AppDispatch,
    setIsLoading?: (isLoading: boolean) => void
) => {
    setIsLoading?.(true);
    try {
        const response = await fetch(`${db}/user/certificates`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get('token')}`,
            },
        });
        const json: ApiEnvelope<MyCertificatesData> = await response.json();

        if (json.success) {
            return json.data?.certificates;
        }

        return dispatch?.(showNotification({ message: json.message ?? 'Failed to load certificates', type: "error" }));
    } catch {
        return dispatch?.(showNotification({ message: 'Failed to load certificates', type: "error" }));
    } finally {
        setIsLoading?.(false);
    }
};

// GET /user/certificates/verify/:certificateNumber  PUBLIC  → data { valid, ... }
export const verifyCertificateApi = async (
    certificateNumber: string,
    setIsLoading?: (isLoading: boolean) => void
) => {
    setIsLoading?.(true);
    try {
        const response = await fetch(`${db}/user/certificates/verify/${certificateNumber}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        const json: ApiEnvelope<VerifyCertificateData> = await response.json();

        if (json.success) {
            return json.data;
        }

        return json.data;
    } catch {
        return undefined;
    } finally {
        setIsLoading?.(false);
    }
};

// GET /user/certificates/:certificateNumber/download  AUTH  → data (url/base64)
export const downloadCertificateApi = async (
    certificateNumber: string,
    dispatch?: AppDispatch,
    setIsLoading?: (isLoading: boolean) => void
) => {
    setIsLoading?.(true);
    try {
        const response = await fetch(`${db}/user/certificates/${certificateNumber}/download`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get('token')}`,
            },
        });
        const json: ApiEnvelope<DownloadCertificateData> = await response.json();

        if (json.success) {
            return json.data;
        }

        return dispatch?.(showNotification({ message: json.message ?? 'Failed to download certificate', type: "error" }));
    } catch {
        return dispatch?.(showNotification({ message: 'Failed to download certificate', type: "error" }));
    } finally {
        setIsLoading?.(false);
    }
};
