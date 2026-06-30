import PDFDocument from "pdfkit";

export const pdfDownload = async (req, res) => {
    const { result } = req.body;

    if (!result) {
        return res.status(400).json({ error: "No content provided" });
    }

    // Configure document with ample 50pt padding for printing margins
    const doc = new PDFDocument({ 
        margin: 50,
        size: 'A4'
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="Note_Mind_IO.pdf"');

    doc.pipe(res);

    // --- DESIGN THEME & CONFIGURATION ---
    const primaryColor = "#18181b"; // Slate-900 
    const accentColor = "#4f46e5";  // Indigo-600
    const mutedColor = "#71717a";   // Zinc-500
    const bgColor = "#f4f4f5";      // Zinc-100 for boxes
    const contentWidth = 495;       // A4 Width (595) minus margins (50 * 2)

    // Helper: Section Header Generator with a clean Left Accent Bar
    const renderSectionHeader = (title) => {
        doc.moveDown(1.5);
        const currentY = doc.y;
        
        // Draw modern vertical accent line
        doc.rect(50, currentY, 4, 18)
           .fill(accentColor);
        
        // Write Heading Text shifted right
        doc.fillColor(primaryColor)
           .font("Helvetica-Bold")
           .fontSize(14)
           .text(title, 62, currentY + 2);
           
        doc.moveDown(0.8);
    };

    // --- 1. HEADER BRANDING ---
    doc.fillColor(accentColor)
       .font("Helvetica-Bold")
       .fontSize(22)
       .text("Note_Mind.IO", { align: "left" });

    // Secondary subhead/branding tagline
    doc.fillColor(mutedColor)
       .font("Helvetica")
       .fontSize(10)
       .text("Automated Academic Preparation Documentation", { align: "left" });

    // Horizontal Separator Rule
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#e4e4e7").lineWidth(1).stroke();
    doc.moveDown(1);

    // --- 2. METADATA INFOBAR ---
    const infoY = doc.y;
    doc.rect(50, infoY, contentWidth, 26).fill(bgColor);
    
    doc.fillColor(primaryColor)
       .font("Helvetica-Bold")
       .fontSize(10)
       .text(`Importance Rating: `, 60, infoY + 8, { continued: true })
       .font("Helvetica")
       .text(`${result.importance || "⭐⭐⭐"}`);
    
    doc.moveDown(1.5);

    // --- 3. SUB TOPICS MATRIX ---
    if (result.subTopics) {
        renderSectionHeader("Sub Topics Breakdown");
        
        Object.entries(result.subTopics).forEach(([star, topics]) => {
            if (!topics || topics.length === 0) return;
            
            doc.fillColor(accentColor)
               .font("Helvetica-Bold")
               .fontSize(11)
               .text(`${star} Priority Matrix`, 50, doc.y);
            
            doc.moveDown(0.3);
            
            topics.forEach((t) => {
                doc.fillColor(primaryColor)
                   .font("Helvetica")
                   .fontSize(10.5)
                   .text(`  ▪  ${t}`, { width: contentWidth, lineGap: 3 });
            });
            doc.moveDown(0.5);
        });
    }

    // --- 4. DETAILED NOTES ANALYSIS ---
    if (result.notes) {
        renderSectionHeader("Comprehensive Notes Analysis");
        
        // Strip markdown structures cleanly while preserving spacing
        const cleanedNotes = result.notes
            .replace(/[#*`‌]/g, "")
            .replace(/\n{3,}/g, "\n\n")
            .trim();

        doc.fillColor(primaryColor)
           .font("Helvetica")
           .fontSize(11)
           .text(cleanedNotes, 50, doc.y, {
               width: contentWidth,
               align: "justify",
               lineGap: 4
           });
    }

    // --- 5. REVISION QUICK-TAKEAWAYS ---
    if (result.revisionPoints && result.revisionPoints.length > 0) {
        renderSectionHeader("Core Exam Takeaways");
        
        result.revisionPoints.forEach((p) => {
            doc.fillColor(primaryColor)
               .font("Helvetica")
               .fontSize(11)
               .text(`✓  ${p}`, { width: contentWidth, lineGap: 4 });
            doc.moveDown(0.3);
        });
    }

    // --- 6. ASSESSMENT AREA ---
    if (result.questions) {
        renderSectionHeader("Self Assessment Pool");

        // Short Questions
        if (result.questions.short && result.questions.short.length > 0) {
            doc.fillColor(accentColor).font("Helvetica-Bold").fontSize(11).text("Conceptual Short Questions");
            doc.moveDown(0.4);
            
            result.questions.short.forEach((q) => {
                doc.fillColor(primaryColor).font("Helvetica").fontSize(10.5).text(`•  ${q}`, { width: contentWidth, lineGap: 3 });
                doc.moveDown(0.2);
            });
            doc.moveDown(0.6);
        }

        // Long Questions
        if (result.questions.long && result.questions.long.length > 0) {
            doc.fillColor(accentColor).font("Helvetica-Bold").fontSize(11).text("Analytical Long Questions");
            doc.moveDown(0.4);
            
            result.questions.long.forEach((q) => {
                doc.fillColor(primaryColor).font("Helvetica").fontSize(10.5).text(`•  ${q}`, { width: contentWidth, lineGap: 3 });
                doc.moveDown(0.2);
            });
            doc.moveDown(0.6);
        }

        // Diagram Prompts
        if (result.questions.diagram) {
            doc.fillColor(accentColor).font("Helvetica-Bold").fontSize(11).text("Structural Diagram Architecture Challenge");
            doc.moveDown(0.4);
            
            // Stylized container box for the diagram prompt
            const boxY = doc.y;
            doc.font("Helvetica-Oblique")
               .fontSize(10.5)
               .fillColor("#374151"); // Charcoal gray text
               
            // Measure string block bounds dynamically before rendering the background rectangle
            const textHeight = doc.heightOfString(result.questions.diagram, { width: contentWidth - 20 });
            
            doc.rect(50, boxY, contentWidth, textHeight + 16).fill("#fafafa");
            doc.rect(50, boxY, contentWidth, textHeight + 16).strokeColor("#e4e4e7").lineWidth(0.5).stroke();
            
            doc.fillColor("#374151")
               .text(result.questions.diagram, 60, boxY + 8, { width: contentWidth - 20 });
        }
    }

    // Finalize generation pipeline
    doc.end();
};