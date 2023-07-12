import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const generatePDF = async (patientData) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const { width, height } = page.getSize();

    const headerText = `Informe creado por Inteligencia Artificial`;
    const patientInfoText = `Información del paciente:`;
    const descriptionTitle = `Descripción del caso:`;
    const reportTitle = `Reporte:`;
    const footerText = `Datos relevantes de la empresa`;

    const titleSize = 18;
    const fontSize = 12;
    const lineHeight = fontSize * 1.2;

    // Header
    page.drawText(headerText, {
        x: 50,
        y: height - 50,
        size: titleSize,
        font: titleFont,
        color: rgb(0, 0, 0),
    });

    // Patient Info
    page.drawText(patientInfoText, {
        x: 50,
        y: height - 90,
        size: titleSize,
        font: titleFont,
        color: rgb(0, 0, 0),
    });

    // Patient Info Box
    const infoBoxX = 50;
    const infoBoxY = height - 130;
    const infoBoxWidth = width - 100;
    const infoBoxHeight = 80;
    page.drawRectangle({
        x: infoBoxX,
        y: infoBoxY,
        width: infoBoxWidth,
        height: infoBoxHeight,
        color: rgb(0.9, 0.9, 0.9),
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
    });

    // Patient Info Content
    const patientInfoContent = [
        `Nombre: ${patientData.name}`,
        `Edad: ${patientData.age}`,
        `Género: ${patientData.gender}`,
        // Agrega más información del paciente según tus necesidades
    ];
    let infoTextY = infoBoxY + infoBoxHeight - 15;
    patientInfoContent.forEach((text) => {
        page.drawText(text, {
        x: infoBoxX + 10,
        y: infoTextY,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
        });
        infoTextY -= lineHeight;
    });

    // Description
    const descriptionTextY = infoBoxY - 30;
    page.drawText(descriptionTitle, {
        x: 50,
        y: descriptionTextY,
        size: titleSize,
        font: titleFont,
        color: rgb(0, 0, 0),
    });
    page.drawText(patientData.description, {
        x: 50,
        y: descriptionTextY - 20,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
        lineHeight,
    });

    // Report
    const reportTextY = descriptionTextY - 150;
    page.drawText(reportTitle, {
        x: 50,
        y: reportTextY,
        size: titleSize,
        font: titleFont,
        color: rgb(0, 0, 0),
    });
    page.drawText(patientData.report, {
        x: 50,
        y: reportTextY - 20,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
        lineHeight,
    });

    // Footer
    const footerTextY = 50;
    page.drawText(footerText, {
        x: 50,
        y: footerTextY,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
};

export default generatePDF
