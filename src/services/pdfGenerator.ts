/**
 * SmartAssess AI: Vector Academic PDF Diploma Generator
 * Generates official, standard-format A4 Landscape PDF diplomas using jsPDF vector primitives.
 * Completely independent of html2canvas/CSS to guarantee 100% reliable standard .pdf downloads.
 */

import { jsPDF } from 'jspdf';
import { Certificate } from '../types/index.ts';

export function generateStandardDiplomaPdf(certificate: Certificate): void {
  // A4 Landscape: 297mm width x 210mm height
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 297;
  const pageHeight = 210;

  // Background subtle cream fill
  doc.setFillColor(248, 245, 238); // #F8F5EE
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Inner certificate white canvas
  doc.setFillColor(255, 255, 255);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16, 'F');

  // Outer Deep Navy Border (3mm thick)
  doc.setDrawColor(11, 25, 44); // #0B192C
  doc.setLineWidth(2.5);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // Inner Gold Accent Border
  doc.setDrawColor(217, 119, 6); // #D97706 (Amber/Gold)
  doc.setLineWidth(0.8);
  doc.rect(14.5, 14.5, pageWidth - 29, pageHeight - 29);

  // Thin Navy Inner Guideline
  doc.setDrawColor(11, 25, 44);
  doc.setLineWidth(0.3);
  doc.rect(16, 16, pageWidth - 32, pageHeight - 32);

  // Corner Decorative Squares
  const corners = [
    [16, 16],
    [pageWidth - 20, 16],
    [16, pageHeight - 20],
    [pageWidth - 20, pageHeight - 20],
  ];
  doc.setFillColor(11, 25, 44);
  corners.forEach(([cx, cy]) => {
    doc.rect(cx - 1.5, cy - 1.5, 3, 3, 'F');
  });

  // Top Institution Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(13, 148, 136); // #0D9488 (Teal)
  const instName = (certificate.institutionName || 'NATIONAL INSTITUTE OF TECHNOLOGY & ENGINEERING').toUpperCase();
  doc.text(instName, pageWidth / 2, 28, { align: 'center' });

  // Main Diploma Title
  doc.setFont('times', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(11, 25, 44); // Deep Navy
  const diplomaTitle = certificate.isCourseCompletion
    ? 'COURSE COMPLETION DIPLOMA'
    : 'CERTIFICATE OF ACHIEVEMENT';
  doc.text(diplomaTitle, pageWidth / 2, 42, { align: 'center' });

  // Decorative Horizontal Line Under Title
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.6);
  doc.line(pageWidth / 2 - 50, 46, pageWidth / 2 + 50, 46);

  // Certification statement
  doc.setFont('times', 'italic');
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.text('This academic credential formally certifies that', pageWidth / 2, 54, { align: 'center' });

  // Candidate Name
  doc.setFont('times', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(11, 25, 44);
  const studentName = (certificate.studentName || 'Student Candidate').toUpperCase();
  doc.text(studentName, pageWidth / 2, 70, { align: 'center' });

  // Name underline
  doc.setDrawColor(13, 148, 136); // Teal
  doc.setLineWidth(1.2);
  const nameWidth = doc.getTextWidth(studentName);
  doc.line(pageWidth / 2 - (nameWidth / 2) - 5, 73, pageWidth / 2 + (nameWidth / 2) + 5, 73);

  // Requirement description
  doc.setFont('times', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(70, 70, 70);
  const desc = certificate.isCourseCompletion
    ? 'has fulfilled all curricular coursework, laboratory practicums, and proctored examinations to graduate from'
    : 'has successfully completed the proctored examination and demonstrated academic excellence in';
  doc.text(desc, pageWidth / 2, 82, { align: 'center' });

  // Course / Assessment Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(13, 148, 136); // Teal
  doc.text(certificate.assessmentTitle, pageWidth / 2, 92, { align: 'center' });

  // Course Code & Title
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(90, 90, 90);
  doc.text(`${certificate.courseTitle}  [Code: ${certificate.courseCode}]`, pageWidth / 2, 99, { align: 'center' });

  // Academic Performance Metrics Box
  const boxY = 108;
  const boxWidth = 170;
  const boxX = (pageWidth - boxWidth) / 2;

  doc.setFillColor(240, 253, 250); // Light teal tint
  doc.setDrawColor(204, 251, 241);
  doc.setLineWidth(0.5);
  doc.roundedRect(boxX, boxY, boxWidth, 24, 3, 3, 'FD');

  // Col 1: Score
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(13, 148, 136);
  doc.text('SCORE OBTAINED', boxX + 28, boxY + 7, { align: 'center' });
  doc.setFontSize(13);
  doc.setTextColor(11, 25, 44);
  doc.text(`${certificate.percentage}%`, boxX + 28, boxY + 16, { align: 'center' });

  // Col 2: Grade
  doc.setFontSize(8);
  doc.setTextColor(13, 148, 136);
  doc.text('HONORS GRADE', boxX + 85, boxY + 7, { align: 'center' });
  doc.setFontSize(12);
  doc.setTextColor(11, 25, 44);
  doc.text(`${certificate.grade}`, boxX + 85, boxY + 16, { align: 'center' });

  // Col 3: Proctoring Integrity
  doc.setFontSize(8);
  doc.setTextColor(13, 148, 136);
  doc.text('AI PROCTORING INTEGRITY', boxX + 142, boxY + 7, { align: 'center' });
  doc.setFontSize(12);
  doc.setTextColor(16, 185, 129); // Emerald
  doc.text(`${certificate.proctoredIntegrity || 98}% Verified`, boxX + 142, boxY + 16, { align: 'center' });

  // Divider lines inside metrics box
  doc.setDrawColor(204, 251, 241);
  doc.line(boxX + 57, boxY + 3, boxX + 57, boxY + 21);
  doc.line(boxX + 114, boxY + 3, boxX + 114, boxY + 21);

  // Signatures & Official Seal Section
  const sigY = 155;

  // Left Signature: Faculty Lead
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.4);
  doc.line(40, sigY + 10, 95, sigY + 10);

  doc.setFont('times', 'italic');
  doc.setFontSize(13);
  doc.setTextColor(30, 30, 30);
  doc.text(certificate.instructorName || 'Dr. Sarah Jenkins', 67.5, sigY + 7, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('COURSE FACULTY LEAD', 67.5, sigY + 15, { align: 'center' });

  // Right Signature: Dean & Registrar
  doc.line(pageWidth - 95, sigY + 10, pageWidth - 40, sigY + 10);

  doc.setFont('times', 'italic');
  doc.setFontSize(13);
  doc.setTextColor(30, 30, 30);
  doc.text('Dr. Elena Rostova', pageWidth - 67.5, sigY + 7, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('ACADEMIC REGISTRAR & DEAN', pageWidth - 67.5, sigY + 15, { align: 'center' });

  // Center Gold / Navy Official Seal
  const sealCenterX = pageWidth / 2;
  const sealCenterY = sigY + 6;

  // Outer seal circle
  doc.setFillColor(11, 25, 44);
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(1);
  doc.circle(sealCenterX, sealCenterY, 13, 'FD');

  // Inner seal circle
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.4);
  doc.circle(sealCenterX, sealCenterY, 11.5, 'D');

  // Seal text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 215, 0); // Gold
  doc.text('SMARTASSESS', sealCenterX, sealCenterY - 3, { align: 'center' });
  doc.setFontSize(9);
  doc.setTextColor(56, 189, 248); // Sky blue
  doc.text('★ VERIFIED ★', sealCenterX, sealCenterY + 1.5, { align: 'center' });
  doc.setFontSize(6);
  doc.setTextColor(255, 255, 255);
  doc.text('ACCREDITED', sealCenterX, sealCenterY + 5.5, { align: 'center' });

  // Footer Metadata Bar
  const footerY = 192;
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.3);
  doc.line(20, footerY - 2, pageWidth - 20, footerY - 2);

  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);

  const issueDateFormatted = new Date(certificate.issueDate).toLocaleDateString([], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(`Issue Date: ${issueDateFormatted}`, 22, footerY + 2);
  doc.text(`Credential ID: ${certificate.certificateNumber}`, pageWidth / 2, footerY + 2, { align: 'center' });
  doc.text(`Verification Hash: ${certificate.verificationCode}`, pageWidth - 22, footerY + 2, { align: 'right' });

  // Direct standard PDF save
  const fileName = `${certificate.certificateNumber}_Official_Diploma.pdf`;
  doc.save(fileName);
}
