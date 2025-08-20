// utils/generateCertificate.ts
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function generateCertificate(
  studentName: string,
  courseName: string
) {
  // Certificate container
  const certificate = document.createElement("div");
  certificate.style.width = "1000px";
  certificate.style.height = "700px";
  certificate.style.padding = "60px";
  certificate.style.textAlign = "center";
  certificate.style.border = "15px solid #d4af37"; // Gold border
  certificate.style.background = "linear-gradient(135deg, #fff, #f9f9f9)";
  certificate.style.fontFamily = "'Georgia', serif";
  certificate.style.position = "relative";

  certificate.innerHTML = `
    <!-- Watermark -->
    <div style="
      position: absolute; 
      top: 50%; 
      left: 50%; 
      transform: translate(-50%, -50%);
      font-size: 100px; 
      color: rgba(200,200,200,0.15);
      font-weight: bold;
      pointer-events: none;
    ">
      Up Next LMS
    </div>

    <h1 style="margin-bottom: 20px; color: #2c3e50; font-size: 42px; letter-spacing: 2px; font-family: 'Times New Roman', serif;">
      🎓 Certificate of Completion 🎓
    </h1>

    <p style="font-size: 20px; margin: 15px 0; color: #555;">This is proudly presented to</p>

    <h2 style="margin: 20px 0; font-size: 36px; font-weight: bold; color: #000; text-transform: uppercase;">
      ${studentName}
    </h2>

    <p style="font-size: 20px; margin: 15px 0; color: #555;">for successfully completing the course</p>

    <h3 style="margin: 20px 0; font-size: 28px; font-weight: bold; color: #2c3e50; text-transform: capitalize;">
      ${courseName}
    </h3>

    <p style="margin-top: 50px; font-size: 18px; color: #333;">Awarded by <b style="color:#d4af37;">Up Next LMS</b></p>

    <div style="display: flex; justify-content: space-between; margin-top: 70px; font-size: 16px; color: #333;">
      
      <div>
        <span>Date: ${new Date().toLocaleDateString()}</span>
      </div>
    </div>
  `;

  document.body.appendChild(certificate);

  // Convert to canvas
  const canvas = await html2canvas(certificate);
  const imgData = canvas.toDataURL("image/png");

  // Generate PDF
  const pdf = new jsPDF("landscape", "px", [canvas.width, canvas.height]);
  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save(`${studentName}-certificate.pdf`);

  // Clean up
  document.body.removeChild(certificate);
}
