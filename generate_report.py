from fpdf import FPDF
import datetime

class SentrySpeedPDF(FPDF):
    def header(self):
        # Header background
        self.set_fill_color(30, 41, 59) # Slate 800
        self.rect(0, 0, 210, 40, 'F')
        
        self.set_y(10)
        self.set_font('helvetica', 'B', 24)
        self.set_text_color(59, 130, 246) # Blue 500
        self.cell(0, 10, '  SENTRYSPEED', ln=True, align='L')
        self.set_font('helvetica', 'I', 10)
        self.set_text_color(203, 213, 225) # Slate 300
        self.cell(0, 10, '   Professional Vehicle Analytics Platform', ln=True, align='L')
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(100, 116, 139) # Slate 500
        self.cell(0, 10, f'Generated on {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")} | Page {self.page_no()}', align='C')

def create_report():
    pdf = SentrySpeedPDF()
    pdf.set_margins(15, 50, 15) # Left, Top, Right
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # Section: Executive Summary
    pdf.set_font('helvetica', 'B', 16)
    pdf.set_text_color(15, 23, 42) # Slate 900 for text on white
    pdf.cell(0, 15, 'Executive Summary', ln=True)
    
    pdf.set_font('helvetica', '', 11)
    pdf.set_text_color(51, 65, 85) # Slate 700
    summary = (
        "SentrySpeed is a cutting-edge vehicle analytics platform designed for real-time surveillance, "
        "speed detection, and license plate recognition. The system leverages state-of-the-art YOLOv8 "
        "computer vision models and a premium dashboard interface to provide actionable intelligence "
        "for traffic management and security applications."
    )
    pdf.multi_cell(0, 8, summary)
    pdf.ln(10)
    
    # Section: Technical Specifications
    pdf.set_font('helvetica', 'B', 16)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 15, 'Technical Specifications', ln=True)
    
    tech_data = [
        ('Detection Core', 'YOLOv8 Nano (optimized for real-time performance)'),
        ('OCR Engine', 'Tesseract OCR with dynamic preprocessing'),
        ('UI Framework', 'HTML5, CSS3 (Glassmorphism), Vanilla JavaScript'),
        ('Backend', 'Flask (Python) with OpenCV integration')
    ]
    
    for label, desc in tech_data:
        pdf.set_font('helvetica', 'B', 12)
        pdf.set_text_color(59, 130, 246)
        pdf.cell(50, 10, f"{label}:")
        pdf.set_font('helvetica', '', 11)
        pdf.set_text_color(51, 65, 85)
        pdf.cell(0, 10, desc, ln=True)
    
    pdf.ln(10)
    
    # Section: UI/UX Features
    pdf.set_font('helvetica', 'B', 16)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 15, 'UI/UX Modernization', ln=True)
    
    features = [
        "- Premium Dark Theme (Slate 900) for high-contrast visibility.",
        "- Glassmorphic Interface for a modern, futuristic aesthetic.",
        "- Responsive Intelligence Dashboard with multi-panel layout.",
        "- Real-time Status Badges indicating safety levels.",
        "- SVG-based icon system for clean, scalable visuals."
    ]
    
    pdf.set_font('helvetica', '', 11)
    pdf.set_text_color(51, 65, 85)
    for feature in features:
        pdf.multi_cell(0, 8, feature)
    
    pdf.ln(10)
    
    # Section: Strategic Implementation
    pdf.set_font('helvetica', 'B', 14)
    pdf.set_text_color(59, 130, 246)
    pdf.cell(0, 15, 'Strategic Outlook', ln=True)
    pdf.set_font('helvetica', '', 11)
    pdf.set_text_color(51, 65, 85)
    outlook = (
        "The current implementation establishes a robust foundation for SentrySpeed. "
        "Future enhancements will focus on distributed multi-camera synchronization, "
        "historical analytics databases, and cloud-based notification gateways."
    )
    pdf.multi_cell(0, 8, outlook)
    
    # Output
    pdf.output("SentrySpeed_Project_Report.pdf")
    print("PDF Report Generated Successfully: SentrySpeed_Project_Report.pdf")

if __name__ == "__main__":
    create_report()

if __name__ == "__main__":
    create_report()
