export type CertificateData = {
  recipientName: string;
  courseTitle: string;
  certificateNumber: string;
  issuedDate: string; // pre-formatted display date
};

// Certificate HTML, rendered to PDF with puppeteer (same pattern as invoice.ts).
export function generateCertificateHTML(data: CertificateData): string {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Certificate of Completion</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Georgia', 'Times New Roman', serif;
    background: #fff;
    color: #1f2937;
  }
  .certificate {
    width: 1100px;
    height: 780px;
    margin: 0 auto;
    padding: 60px;
    border: 14px solid #0f172a;
    outline: 3px solid #c9a44c;
    outline-offset: -22px;
    text-align: center;
    position: relative;
  }
  .logo { width: 120px; height: auto; margin-bottom: 10px; }
  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 6px;
    font-size: 14px;
    color: #c9a44c;
    margin-top: 20px;
  }
  h1 {
    font-size: 52px;
    font-weight: 400;
    letter-spacing: 2px;
    margin: 10px 0 4px;
  }
  .subtitle { font-size: 16px; color: #6b7280; margin-bottom: 40px; }
  .awarded { font-size: 16px; color: #6b7280; }
  .name {
    font-size: 40px;
    font-style: italic;
    margin: 16px 0;
    border-bottom: 2px solid #c9a44c;
    display: inline-block;
    padding: 0 40px 8px;
  }
  .course-line { font-size: 18px; margin-top: 26px; color: #374151; }
  .course-title { font-size: 26px; font-weight: bold; margin-top: 8px; }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 80px;
    font-size: 13px;
    color: #6b7280;
  }
  .footer .block { text-align: left; }
  .footer .block.right { text-align: right; }
  .sig {
    font-family: 'Brush Script MT', cursive;
    font-size: 26px;
    color: #0f172a;
    border-top: 1px solid #9ca3af;
    padding-top: 6px;
    margin-top: 30px;
  }
</style>
</head>
<body>
  <div class="certificate">
    <img class="logo" src="https://storage.googleapis.com/lms-platform12/logo/up_next.png" alt="Up Next">
    <div class="eyebrow">Certificate</div>
    <h1>Certificate of Completion</h1>
    <div class="subtitle">Up Next Academy</div>

    <div class="awarded">This is proudly presented to</div>
    <div class="name">${escapeHtml(data.recipientName)}</div>

    <div class="course-line">for successfully completing the course</div>
    <div class="course-title">${escapeHtml(data.courseTitle)}</div>

    <div class="footer">
      <div class="block">
        <div class="sig">Up Next Academy</div>
        Authorized Signatory
      </div>
      <div class="block right">
        <div><strong>Certificate No:</strong> ${escapeHtml(data.certificateNumber)}</div>
        <div><strong>Issued:</strong> ${escapeHtml(data.issuedDate)}</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
