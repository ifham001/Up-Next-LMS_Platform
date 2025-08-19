export const downloadPdf = (base64PDF: string, fileName = "invoice.pdf") => {
    const byteArray = Uint8Array.from(atob(base64PDF), (c) => c.charCodeAt(0));
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
  
    URL.revokeObjectURL(url);
  };
  