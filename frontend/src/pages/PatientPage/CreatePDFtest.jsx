import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const generatePDF = async (patientData) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  const primaryColor = rgb(0, 0, 0); // Color primario (negro)
  const secondaryColor = rgb(25 / 255, 134 / 255, 210 / 255); // Color secundario (#1986d2)

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { width, height } = page.getSize();

  const headerText = 'Informe creado por Inteligencia Artificial';
  const specialistText = 'Especialista en anatomía patológica';
  const patientInfoTitle = 'Información del paciente:';
  const descriptionTitle = 'Descripción médica del caso:';
  const reportTitle = 'Reporte generado por Inteligencia Artificial';
  const footerText =
  'Documento creado por un modelo de inteligencia artificial.\nRespaldado por el doctor NOMBRE-APELLIDO.\nFirma y sello del médico';  const titleSize = 18;
  const fontSize = 12;
  const lineHeight = fontSize * 1.2;

  // Header
  page.drawText(headerText, {
    x: 50,
    y: height - 50,
    size: titleSize,
    font: titleFont,
    color: primaryColor,
  });

  // Specialist
  page.drawText(specialistText, {
    x: 50,
    y: height - 80,
    size: fontSize,
    font,
    color: primaryColor,
    underline: true,
  });

  // Current Date
  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  page.drawText(currentDate, {
    x: width - 150,
    y: height - 80,
    size: fontSize,
    font,
    color: primaryColor,
  });

  // Line Divider
  page.drawLine({
    start: { x: 50, y: height - 135 },
    end: { x: width - 50, y: height - 135 },
    thickness: 0.5,
    color: secondaryColor,
  });

  // Patient Info Title
  page.drawText(patientInfoTitle, {
    x: 50,
    y: height - 160,
    size: titleSize,
    font: titleFont,
    color: primaryColor,
  });

  // Patient Info Content
  const patientInfoContent = [
    ` • Nombre: ${patientData.name}`,
    ` • Apellido: ${patientData.lastName}`,
    ` • Género: ${patientData.gender}`,
    ` • Fecha de nacimiento: ${formatBirthDate(patientData.birth_date)}`,
    ` • Edad: ${formatBirthDate(patientData.age)} años`,
    ` • DNI: ${formatBirthDate(patientData.DNI)}`,
    ` • Obra Social: ${formatBirthDate(patientData.social_security)}`,
  ];

  const infoListX = 50;
  let infoListY = height - 200;

  patientInfoContent.forEach((text) => {
    page.drawText(text, {
      x: infoListX + 15,
      y: infoListY,
      size: fontSize,
      font,
      color: primaryColor,
    });
    infoListY -= lineHeight;
  });

  // Description
  const descriptionTextY = infoListY - (patientInfoContent.length + 1) * lineHeight - 30;

  page.drawLine({
    start: { x: 50, y: descriptionTextY },
    end: { x: width - 50, y: descriptionTextY },
    thickness: 0.5,
    color: secondaryColor,
  });

  page.drawText(descriptionTitle, {
    x: 50,
    y: descriptionTextY - 30,
    size: titleSize,
    font: titleFont,
    color: primaryColor,
  });

  page.drawText(patientData.description, {
    x: 50,
    y: descriptionTextY - 60,
    size: fontSize,
    font,
    color: primaryColor,
    maxWidth: width - 100,
    lineHeight: lineHeight,
  });

  // Report
  const reportTextY = descriptionTextY - 200;

  page.drawLine({
    start: { x: 50, y: reportTextY },
    end: { x: width - 50, y: reportTextY },
    thickness: 0.5,
    color: secondaryColor,
  });

  page.drawText(reportTitle, {
    x: 50,
    y: reportTextY - 30,
    size: titleSize,
    font: titleFont,
    color: primaryColor,
  });

  page.drawText(patientData.report, {
    x: 50,
    y: reportTextY - 60,
    size: fontSize,
    font,
    color: primaryColor,
    maxWidth: width - 100,
    lineHeight: lineHeight,
  });

  // Footer
  const footerTextY = 70;

  page.drawLine({
    start: { x: 50, y: footerTextY },
    end: { x: width - 50, y: footerTextY },
    thickness: 0.5,
    color: secondaryColor,
  });

  page.drawText(footerText, {
    x: 50,
    y: footerTextY - 30,
    size: fontSize - 2,
    font,
    color: primaryColor,
    maxWidth: width - 100,
    lineHeight: 15,
    textAlign: 'center',
  });

  const pdfBytes = await pdfDoc.save();

  return pdfBytes;
};

const formatBirthDate = (birthDate) => {
    const date = new Date(birthDate);
    if (isNaN(date)) {
      return 'Fecha de nacimiento inválida';
    }
    const dateFormat = format(new Date(birthDate), 'dd/MM/yyyy', { locale: es });
    return dateFormat;
  };

export default generatePDF;
