const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendCertificateEmail = async (toEmail, userName, pdfPath, category = 'Participant') => {
  try {
    // Read the PDF file
    const fs = require('fs');
    const pdfBuffer = fs.readFileSync(pdfPath);

    const categoryLabel = category.toUpperCase();

    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'TEDx Veritas University <onboarding@resend.dev>',
      to: toEmail,
      subject: 'Your TEDxVeritasUniversity Certificate of Attendance',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fafafa;">
          <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: #000; border-radius: 8px;">
            <h1 style="color: #EB0028; margin: 0; font-size: 32px;">
              TED<span style="color: #fff;">x</span>VeritasUniversity
            </h1>
          </div>
          
          <div style="background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #1a1a1a; text-align: center; margin-top: 0;">Congratulations, ${userName}!</h2>
            
            <p style="color: #666; line-height: 1.6; text-align: center;">
              Thank you for attending <strong style="color: #EB0028;">TEDxVeritasUniversity: Neo-Intelligence</strong> 
              on Saturday, May 16, 2026 at Veritas University, Abuja.
            </p>
            
            <div style="text-align: center; margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 8px; border-left: 4px solid #EB0028;">
              <p style="color: #EB0028; margin: 0; font-weight: bold; font-size: 16px;">${categoryLabel} CATEGORY</p>
              <p style="color: #666; margin: 5px 0 0 0; font-size: 13px;">Your certificate reflects your registration category</p>
            </div>
            
            <p style="color: #666; line-height: 1.6; text-align: center;">
              Your participation made this event special. Please find your official certificate of attendance attached to this email.
            </p>
            
            <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f5f5f5; border-radius: 8px; border-left: 4px solid #EB0028;">
              <p style="color: #EB0028; margin: 0; font-weight: bold; font-size: 18px;">NEO-INTELLIGENCE</p>
              <p style="color: #666; margin: 5px 0 0 0; font-size: 13px;">Shaping an Intelligent Africa Through Innovation and Culture</p>
            </div>
          </div>
          
          <p style="color: #999; font-size: 11px; text-align: center; margin-top: 20px;">
            © 2026 TEDxVeritasUniversity • Licensed by TED • All rights reserved
          </p>
        </div>
      `,
      attachments: [
        {
          filename: 'TEDxVeritasUniversity_Certificate.pdf',
          content: pdfBuffer.toString('base64'),
          contentType: 'application/pdf'
        }
      ]
    });

    return { success: true, data };
  } catch (error) {
    console.error('Resend email error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendCertificateEmail };