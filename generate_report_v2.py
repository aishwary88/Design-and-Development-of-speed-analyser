from fpdf import FPDF
import datetime

def create_simple_report():
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", 'B', 16)
    pdf.cell(200, 10, txt="SENTRYSPEED PROJECT REPORT", ln=True, align='C')
    pdf.ln(10)
    
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, txt=f"Report Generated: {datetime.datetime.now().strftime('%Y-%m-%d')}\n")
    pdf.ln(5)
    
    pdf.set_font("Arial", 'B', 14)
    pdf.cell(200, 10, txt="1. Project Overview", ln=True)
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, txt="SentrySpeed is a professional vehicle analytics dashboard featuring real-time speed detection and license plate recognition using YOLOv8 and OCR.")
    pdf.ln(5)
    
    pdf.set_font("Arial", 'B', 14)
    pdf.cell(200, 10, txt="2. Visual Modernization", ln=True)
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, txt="- Dark Theme: Slate-based professional palette.\n- Glassmorphism: Modern translucent UI elements.\n- Dashboard Layout: Organized multi-panel intelligence view.")
    pdf.ln(5)
    
    pdf.set_font("Arial", 'B', 14)
    pdf.cell(200, 10, txt="3. Technical Stack", ln=True)
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, txt="- Backend: Python/Flask\n- Vision: YOLOv8 (Ultralytics)\n- Frontend: Modern CSS Grid/Flexbox\n- OCR: Tesseract")
    
    pdf.output("SentrySpeed_Project_Report.pdf")
    print("PDF Generated.")

if __name__ == "__main__":
    create_simple_report()
